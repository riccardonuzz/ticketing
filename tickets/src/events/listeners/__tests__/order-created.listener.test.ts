import { OrderCreatedEvent, OrderStatus } from "@riccardonuzz-org/common"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created.listener"


const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '23d32'
    })

    await ticket.save()

    const data: OrderCreatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        status: OrderStatus.Created,
        userId: '32r2f',
        expiresAt: 'asd23r',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, message, ticket, data }
}

it('Sets the userId of the ticket', async () => {
    const { listener, data, ticket, message } = await setup()
    await listener.onMessage(data, message)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('Akcs the message', async () => {
    const { listener, data, message } = await setup()
    await listener.onMessage(data, message)

    expect(message.ack).toHaveBeenCalled()
})

it('Publishes a ticket updated event', async () => {
    const { listener, data, message } = await setup()
    await listener.onMessage(data, message)
    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const callJSON = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    const ticketUpdatedData = JSON.parse(callJSON)

    expect(data.id).toEqual(ticketUpdatedData.orderId)
})