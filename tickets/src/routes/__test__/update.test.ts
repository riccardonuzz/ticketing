import { Types } from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'


it('Returns a 404 if the provided id does not exist', async () => {
    const id = new Types.ObjectId().toHexString()

    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', signin())
        .send({
            title: 'Title',
            price: 30
        })

    expect(response.status).toEqual(404)
})

it('Returns a 401 if the user is not authenticated', async () => {
    const id = new Types.ObjectId().toHexString()

    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'Title',
            price: 30
        })

    expect(response.status).toEqual(401)
})

it('Returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'title',
            price: 10
        })
        .expect(201)

    const updateResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', signin())
        .send({
            title: 'Title',
            price: 30
        })

    expect(updateResponse.status).toEqual(401)
})


it('Returns a 400 if the user provide an invalid title or price', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'title',
            price: 10
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', signin())
        .send({
            title: '',
            price: 30
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', signin())
        .send({
            title: 'Title',
            price: -10
        })
        .expect(400)
})

it('Update the ticket provided with valid inputs', async () => {
    const cookie = signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 10
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'New title',
            price: 30
        })
        .expect(200)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send()

    expect(ticketResponse.body.title).toEqual('New title')
    expect(await ticketResponse.body.price).toEqual(30)

})


it('Publishes an event', async () => {
    const cookie = signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 10
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'New title',
            price: 30
        })
        .expect(200)

    await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send()

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('Rejects update if ticket is reserved', async () => {
    const cookie = signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 10
        })
        .expect(201)

    const ticket = await Ticket.findById(response.body.id)
    ticket!.set({ orderId: new Types.ObjectId().toHexString() })
    await ticket!.save()

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'New title',
            price: 30
        })
        .expect(400)
})