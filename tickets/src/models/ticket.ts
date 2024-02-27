import { Schema, Model, model, Document } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

interface TicketDocument extends Document, TicketAttrs {
    createdAt: string,
    updatedAt: string,
    version: number,
    orderId?: string,
}

interface TicketModel extends Model<TicketDocument> {
    build(attrs: TicketAttrs): TicketDocument
}

const ticketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String
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

ticketSchema.statics.build = (attributes: TicketAttrs) => {
    return new Ticket(attributes)
}

const Ticket = model<TicketDocument, TicketModel>('Ticket', ticketSchema)


export { Ticket }
