import { OrderCancelledEvent, OrderStatus } from "@riccardonuzz-org/common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled.listener"


const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const order = Order.build({
        id: new Types.ObjectId().toHexString(),
        status: OrderStatus.Cancelled,
        price: 10,
        userId: '13e23r',
        version: 0
    })
    await order.save()

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'qwed132er',
        }
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, message, data }
}

it('Updates the status of the order', async () => {
    const { listener, data, message } = await setup()
    await listener.onMessage(data, message)

    const order = await Order.findById(data.id)
    expect(order!.id).toEqual(data.id)
    expect(order!.status).toEqual(OrderStatus.Cancelled)
})

it('Acks the message', async () => {
    const { listener, data, message } = await setup()
    await listener.onMessage(data, message)

    expect(message.ack).toHaveBeenCalled()
})