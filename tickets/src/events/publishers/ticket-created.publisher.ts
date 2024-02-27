import { Publisher, Subjects, TicketCreatedEvent } from "@riccardonuzz-org/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}