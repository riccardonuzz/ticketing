import { Listener, Subjects, TicketUpdatedEvent } from "@riccardonuzz-org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queGroupName } from "./queue-groun-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
    queueGroupName: string = queGroupName

    async onMessage(data: TicketUpdatedEvent['data'], message: Message) {
        const { title, price } = data

        const ticket = await Ticket.findByEvent(data)

        if (!ticket) {
            throw new Error('Ticket not found')
        }

        ticket.set({ title, price })
        ticket.markModified('title', 'price')
        await ticket.save()
        message.ack()
    }
}