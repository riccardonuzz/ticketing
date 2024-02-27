import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from "@riccardonuzz-org/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled.publisher";
import { queGroupName } from "./queue-groun-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
    queueGroupName: string = queGroupName

    async onMessage(data: ExpirationCompleteEvent['data'], message: Message) {
        const { orderId } = data

        const order = await Order.findById(orderId).populate('ticket')

        if (!order) {
            throw new Error('Order not found.')
        }

        if (order.status === OrderStatus.Complete) {
            return message.ack()
        }

        order.set({
            status: OrderStatus.Cancelled,
        })
        await order.save()
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        message.ack()
    }
}