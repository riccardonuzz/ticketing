import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'


it('Has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})

    expect(response.status).not.toEqual(404)
})

it('Can only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401)
})

it('Return a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({})

    expect(response.status).not.toEqual(401)
})

it('Returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400)

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            price: 10
        })
        .expect(400)
})

it('Return an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'This is a title',
            price: -10
        })
        .expect(400)

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'This is a title',
        })
        .expect(400)
})

it('Creates a ticket with valid parameters', async () => {
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    const price = 10
    const title = 'This is a title'

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title,
            price
        })
        .expect(201)

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].price).toEqual(price)
    expect(tickets[0].title).toEqual(title)
})

it('Publishes an event', async () => {
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    const price = 10
    const title = 'This is a title'

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title,
            price
        })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})