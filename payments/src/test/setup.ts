import { MongoMemoryServer } from 'mongodb-memory-server'
import jwt from 'jsonwebtoken'
import { Types, connect, connection } from 'mongoose'

declare global {
    var signin: (id?: string) => string;
}

jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = 'sk_test_51OmJZ4F8RJE7Sy1NYabTUE6bvdfcwVRbh4eD1sTgSxfjq3pLbCG32HPmHoLE4JpQc1jsOtkgwqpPZMvmHutaKveK009Hi405yv'

let mongo: MongoMemoryServer | null = null

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasd'

    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()

    await connect(mongoUri, {})
})

beforeEach(async () => {
    jest.clearAllMocks()
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

global.signin = (id?: string) => {
    const payload = {
        id: id || new Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    const token = jwt.sign(payload, process.env.JWT_KEY!)
    const session = { jwt: token }
    const sessionJSON = JSON.stringify(session)

    const base64 = Buffer.from(sessionJSON).toString('base64')


    return `session=${base64}`
}