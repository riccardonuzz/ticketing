import { Listener, OrderCancelledEvent, Subjects } from "@riccardonuzz-org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher";
import { queueGroupName } from "./queue-group-name";


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName: string = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], message: Message) {
        const { ticket } = data
        const orderTicket = await Ticket.findById(ticket.id)

        if (!orderTicket) {
            throw new Error('Ticket not found')
        }

        orderTicket.set({ orderId: undefined })
        await orderTicket.save()

        await new TicketUpdatedPublisher(this.client).publish({
            id: orderTicket.id,
            orderId: orderTicket.orderId,
            userId: orderTicket.userId,
            price: orderTicket.price,
            title: orderTicket.title,
            version: orderTicket.version
        })

        message.ack()
    }

}