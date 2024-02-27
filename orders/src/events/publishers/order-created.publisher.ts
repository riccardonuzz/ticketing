import { Publisher, Subjects, OrderCreatedEvent } from "@riccardonuzz-org/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}