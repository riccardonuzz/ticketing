import request from 'supertest'
import { app } from '../../app'


const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'Ticket 1',
            price: 10
        })
        .expect(201)
}

it('Can fetch a list of tickets', async () => {
    await createTicket()
    await createTicket()
    await createTicket()


    await request(app)
        .get(`/api/tickets`)
        .set('Cookie', signin())
        .send()
        .expect(200)
})