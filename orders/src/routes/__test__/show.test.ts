import { Ticket } from "../../models/ticket"
import request from 'supertest'
import { app } from "../../app"
import { Types } from "mongoose"

it('Fetches the order', async () => {
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

    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)

    expect(fetchedOrder.id).toEqual(order.id)
})


it('Returns an error if a user tries to fetch another user\'s order', async () => {
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
        .get(`/api/orders/${order.id}`)
        .set('Cookie', signin())
        .send()
        .expect(401)
})