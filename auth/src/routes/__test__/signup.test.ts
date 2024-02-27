import request from "supertest"
import { app } from "../../app"


it('Returns a 201 on successful signup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
})

it('Return a 400 with an invalid email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'asfd23rsdf',
            password: 'password'
        })
        .expect(400)
})

it('Return a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400)
})

it('Disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
})

it('Sets cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
})