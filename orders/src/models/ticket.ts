import { OrderStatus } from '@riccardonuzz-org/common';
import { Schema, Model, model, Document } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order } from './order';

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

export interface TicketDocument extends Document<string, any, TicketAttrs> {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>
}

interface TicketModel extends Model<TicketDocument> {
    build(attrs: TicketAttrs): TicketDocument;
    findByEvent(event: { id: string, version: number }): Promise<TicketDocument | null>
}

const ticketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
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

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.findByEvent = (data: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: data.id,
        version: data.version - 1
    })
}
ticketSchema.statics.build = (attributes: TicketAttrs) => {
    return new Ticket({
        _id: attributes.id,
        title: attributes.title,
        price: attributes.price
    })
}

ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this.id,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })

    return !!existingOrder
}

const Ticket = model<TicketDocument, TicketModel>('Ticket', ticketSchema)


export { Ticket }
