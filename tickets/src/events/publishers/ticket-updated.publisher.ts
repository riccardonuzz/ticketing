import { Publisher, Subjects, TicketUpdatedEvent } from "@riccardonuzz-org/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}