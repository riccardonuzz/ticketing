import { Listener, OrderCreatedEvent, Subjects } from "@riccardonuzz-org/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration.queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName: string = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], message: Message) {
        const { id, expiresAt } = data
        const delay = new Date(expiresAt).getTime() - new Date().getTime()
        console.log('Waiting this many milliseconds to process the job: ', delay)

        await expirationQueue.add(
            {
                orderId: id
            },
            {
                delay
            }
        )

        message.ack()
    }

}

