import { Types } from 'mongoose'
import request from 'supertest'
import { app } from '../../app'


it('Return a 404 if the ticket is not found', async () => {
    const id = new Types.ObjectId().toHexString()
    await request(app)
        .get(`/api/tickets/${id}`)
        .set('Cookie', signin())
        .send()
        .expect(404)
})

it('Returns the ticket if the ticket is found', async () => {
    const title = 'This is a title'
    const price = 10

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title,
            price
        })
        .expect(201)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', signin())
        .send()
        .expect(200)

    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
})