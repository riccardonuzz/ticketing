import { ExpirationCompleteEvent, OrderStatus } from "@riccardonuzz-org/common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete.listener"


const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client)

    const ticket = Ticket.build({
        id: new Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    })
    await ticket.save()

    const order = Order.build({
        status: OrderStatus.Cancelled,
        userId: 'ibqwd13',
        expiresAt: new Date(),
        ticket,
    })
    await order.save()

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, message, data, order, ticket }
}

it('Updates the order status to cancelled', async () => {
    const { listener, data, message, order } = await setup()
    await listener.onMessage(data, message)

    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('Emit an OrderCancelled event', async () => {
    const { listener, data, message, order } = await setup()
    await listener.onMessage(data, message)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const eventData = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    const parsedEventData = JSON.parse(eventData)

    expect(parsedEventData.id).toEqual(order.id)
})

it('Ack the message', async () => {
    const { listener, data, message } = await setup()
    await listener.onMessage(data, message)

    expect(message.ack).toHaveBeenCalled()
})