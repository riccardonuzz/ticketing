import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, connection } from 'mongoose'
import { app } from '../app';

declare global {
    var signup: () => Promise<string[]>;
}

let mongo: MongoMemoryServer | null = null

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasd'

    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()

    await connect(mongoUri, {})
})

beforeEach(async () => {
    const collections = await connection.db.collections()

    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    if (mongo) {
        await mongo.stop()
        await connection.close()
    }
})

global.signup = async () => {
    const email = 'test@test.com'
    const password = 'password'

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
    expect(201)

    const cookie = response.get('Set-Cookie')

    return cookie
}