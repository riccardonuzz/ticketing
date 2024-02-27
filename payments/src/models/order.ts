import { OrderStatus } from '@riccardonuzz-org/common';
import { Schema, Model, model, Document } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface OrderAttrs {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus
}

interface OrderDocument extends Document<any, any, OrderAttrs> {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus
}

interface OrderModel extends Model<OrderDocument> {
    build(attrs: OrderAttrs): OrderDocument
}

const orderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
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

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attributes: OrderAttrs) => {
    return new Order({
        _id: attributes.id,
        version: attributes.version,
        price: attributes.price,
        userId: attributes.userId,
        status: attributes.status
    })
}

const Order = model<OrderDocument, OrderModel>('Order', orderSchema)


export { Order }
