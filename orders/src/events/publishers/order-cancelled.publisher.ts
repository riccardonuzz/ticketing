import { Publisher, Subjects, OrderCancelledEvent } from "@riccardonuzz-org/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}