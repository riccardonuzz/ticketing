import { OrderCreatedEvent, OrderStatus } from "@riccardonuzz-org/common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created.listener"


const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const data: OrderCreatedEvent['data'] = {
        id: new Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: '32r2f',
        expiresAt: 'asd23r',
        ticket: {
            id: '3qd23r',
            price: 10
        }
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, message, data }
}

it('Replicates the order info', async () => {
    const { listener, data,  message } = await setup()
    await listener.onMessage(data, message)

    const order = await Order.findById(data.id)
    expect(order!.price).toEqual(data.ticket.price)
})

it('Akcs the message', async () => {
    const { listener, data, message } = await setup()
    await listener.onMessage(data, message)

    expect(message.ack).toHaveBeenCalled()
})