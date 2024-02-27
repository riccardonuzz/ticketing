import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@riccardonuzz-org/common'
import express, { Request, Response } from 'express'
import { Order } from '../models/order'

const router = express.Router()

router.get(
    '/api/orders/:id',
    requireAuth,
    validateRequest,
    async (request: Request, response: Response) => {
        const { id } = request.params
        const order = await Order.findById(id).populate('ticket')

        if (!order) {
            throw new NotFoundError()
        }

        if (order.userId !== request.currentUser!.id) {
            throw new NotAuthorizedError()
        }

        response.status(200).send(order)
    })

export { router as showOrderRouter }