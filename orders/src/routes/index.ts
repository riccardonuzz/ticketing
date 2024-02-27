import { requireAuth, validateRequest } from '@riccardonuzz-org/common'
import express, { Request, Response } from 'express'
import { Order } from '../models/order'

const router = express.Router()

router.get(
    '/api/orders',
    requireAuth,
    validateRequest,
    async (request: Request, response: Response) => {
        const orders = await Order
            .find({ userId: request.currentUser!.id })
            .populate('ticket')

        response.status(200).send(orders)
    })

export { router as indexOrderRouter }