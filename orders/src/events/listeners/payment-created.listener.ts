import { Listener, Subjects, PaymentCreatedEvent, OrderStatus } from "@riccardonuzz-org/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queGroupName } from "./queue-groun-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
    queueGroupName: string = queGroupName

    async onMessage(data: PaymentCreatedEvent['data'], message: Message) {
        const { orderId } = data

        const order = await Order.findById(orderId)

        if (!order) {
            throw new Error('Order not found')
        }

        order.set({
            status: OrderStatus.Complete
        })
        await order.save()

        message.ack()
    }
}