import { Publisher, Subjects, ExpirationCompleteEvent } from "@riccardonuzz-org/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}