import { OrderCancelledEvent } from "@riccardonuzz-org/common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled.listener"


const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const orderId = new Types.ObjectId().toHexString()

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '23d32'
    })
    ticket.set({ orderId })
    await ticket.save()

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, message, ticket, data, orderId }
}

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { listener, data, ticket, message } = await setup()
    await listener.onMessage(data, message)

    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).not.toBeDefined()
    expect(message.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()

})