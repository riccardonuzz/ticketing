import { connect } from 'mongoose'
import { app } from './app'

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined.')
    }

    if (!process.env.MONGO_URI) {
        throw new Error('JWT_KEY must be defined.')
    }

    try {
        await connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB database.')
    } catch (error) {
        console.log(error)
    }
}

app.listen(3000, () => {
    console.log('Auth service is listening on port 3000!')
})

start()