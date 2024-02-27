import { TicketCreatedEvent } from "@riccardonuzz-org/common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created.listener"


const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client)
    
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new Types.ObjectId().toHexString(),
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, message, data }
}

it('Creates and saves a ticket', async () => {
    const { listener, data, message } = await setup()
    await listener.onMessage(data, message)
    const ticket = await Ticket.findById(data.id)
    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)
})

it('Akcs the message', async () => {
    const { listener, data, message } = await setup()
    await listener.onMessage(data, message)

    expect(message.ack).toHaveBeenCalled()
})