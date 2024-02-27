import { Ticket } from "../../models/ticket"
import request from 'supertest'
import { app } from "../../app"
import { Order } from "../../models/order"
import { OrderStatus } from '@riccardonuzz-org/common'
import { natsWrapper } from "../../nats-wrapper"
import { Types } from "mongoose"


it('Marks an order as cancelled', async () => {
    const ticket = Ticket.build({
        id: new Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    const user = signin()

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    const cancelledOrder = await Order.findById(order.id)

    expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled)

})

it('Emits an order cancelled event', async () => {
    const ticket = Ticket.build({
        id: new Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    const user = signin()

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})