import { Listener, OrderCreatedEvent, Subjects } from "@riccardonuzz-org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName: string = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], message: Message) {
        const { ticket } = data
        const orderTicket = await Ticket.findById(ticket.id)

        if (!orderTicket) {
            throw new Error('Ticket not found.')
        }

        orderTicket.set({ orderId: data.id })
        await orderTicket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: orderTicket.id,
            price: orderTicket.price,
            title: orderTicket.title,
            userId: orderTicket.userId,
            orderId: orderTicket.orderId,
            version: orderTicket.version
        })
        message.ack()
    }

}

