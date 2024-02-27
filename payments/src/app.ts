import express from 'express'
import 'express-async-errors' // not needed anymore as it is already included in expresss
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUser, errorHandler } from '@riccardonuzz-org/common'
import { NotFoundError } from '@riccardonuzz-org/common'
import { createChargeRouter } from './routes/new'
import { paymentIntentRouter } from './routes/paymentIntent'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))
app.use(currentUser)
app.use(createChargeRouter)
app.use(paymentIntentRouter)


app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)


export { app }