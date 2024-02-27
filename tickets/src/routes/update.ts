import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@riccardonuzz-org/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated.publisher'
import { Ticket } from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')
            .not()
            .isEmpty()
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (request: Request, response: Response) => {
        const ticket = await Ticket.findById(request.params.id)
        const { title, price } = request.body

        if (!ticket) {
            throw new NotFoundError()
        }

        if (ticket.orderId) {
            throw new BadRequestError('Cannot edit a reserved ticket.')
        }

        if (request.currentUser!.id !== ticket.userId) {
            throw new NotAuthorizedError()
        }

        ticket.set({
            title,
            price
        })
        await ticket.save()

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })

        response.send(ticket)
    })

export { router as updateTicketRouter }