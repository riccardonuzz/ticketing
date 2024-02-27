import { OrderStatus } from '@riccardonuzz-org/common';
import { Schema, Model, model, Document } from 'mongoose'
import { TicketDocument } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
}

interface OrderDocument extends Document, OrderAttrs {
   version: number;
}

interface OrderModel extends Model<OrderDocument> {
    build(attrs: OrderAttrs): OrderDocument
}

const orderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: Schema.Types.Date,
        required: true
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attributes: OrderAttrs) => {
    return new Order(attributes)
}

const Order = model<OrderDocument, OrderModel>('Order', orderSchema)


export { Order }
