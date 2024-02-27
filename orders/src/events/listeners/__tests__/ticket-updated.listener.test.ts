import { TicketUpdatedEvent } from "@riccardonuzz-org/common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated.listener"


const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        id: new Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    })

    await ticket.save()

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: 'd239rh23rf'
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, message, ticket, data }
}

it('Find updateds and saves a ticket', async () => {
    const { listener, data, ticket, message } = await setup()
    await listener.onMessage(data, message)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})

it('Akcs the message', async () => {
    const { listener, data, message } = await setup()
    await listener.onMessage(data, message)

    expect(message.ack).toHaveBeenCalled()
})

it('Does not call ack if the event has a skipped version number', async () => {
    const { listener, data, message } = await setup()
    data.version = 10

    try {
        await listener.onMessage(data, message)
    } catch (error) {

    }

    expect(message.ack).not.toHaveBeenCalled()
})