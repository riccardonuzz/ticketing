import { Listener, OrderCreatedEvent, Subjects } from "@riccardonuzz-org/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName: string = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], message: Message) {
        const { id, status, userId, ticket, version } = data
        const order = Order.build({
            id,
            price: ticket.price,
            status,
            userId,
            version
        })
        await order.save()

        message.ack()
    }

}

