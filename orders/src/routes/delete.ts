import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@riccardonuzz-org/common'
import express, { Request, Response } from 'express'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled.publisher'
import { Order } from '../models/order'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete(
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

        order.status = OrderStatus.Cancelled
        await order.save()

        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        response.status(204).send(order)
    })

export { router as deleteOrderRouter }