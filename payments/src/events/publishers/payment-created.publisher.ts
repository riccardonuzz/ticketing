import { Publisher, Subjects, PaymentCreatedEvent } from "@riccardonuzz-org/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}