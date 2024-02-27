import { Listener, Subjects, TicketCreatedEvent } from "@riccardonuzz-org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queGroupName } from "./queue-groun-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName: string = queGroupName

    async onMessage(data: TicketCreatedEvent['data'], message: Message) {
        const { id, title, price } = data
        const ticket = Ticket.build({
            id,
            title,
            price
        })

        await ticket.save()
        message.ack()
    }
}