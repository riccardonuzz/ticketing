import { Schema, Model, model, Document } from 'mongoose'


interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}

interface PaymentDocument extends Document<any, any, PaymentAttrs> {
    orderId: string;
    stripeId: string;
    version: number;
}

interface PaymentModel extends Model<PaymentDocument> {
    build(attrs: PaymentAttrs): PaymentDocument
}

const paymentSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
})

paymentSchema.statics.build = (attributes: PaymentAttrs) => {
    return new Payment(attributes)
}

const Payment = model<PaymentDocument, PaymentModel>('Payment', paymentSchema)


export { Payment }
