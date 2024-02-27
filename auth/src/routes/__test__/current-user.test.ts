import request from "supertest"
import { app } from "../../app"


it('Responds with details of the current user', async () => {
    const cookie = await signup()

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(response.body.currentUser.email).toEqual('test@test.com')
})


it('Responds with null if not authenticated', async () => {
    await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(401)
})