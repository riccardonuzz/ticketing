import request from "supertest"
import { app } from "../../app"


it('Clears the cookie after signing out', async () => {
    // due to memory db, this account does not exist so an arror is thrown
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const response = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200)

    const [expiredCookie] = response.get('Set-Cookie')
    expect(expiredCookie).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
})
