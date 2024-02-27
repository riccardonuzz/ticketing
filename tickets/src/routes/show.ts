import { NotFoundError, requireAuth, validateRequest } from '@riccardonuzz-org/common'
import express, { Request, Response } from 'express'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get(
    '/api/tickets/:id',
    requireAuth,
    validateRequest,
    async (request: Request, response: Response) => {
        const ticket = await Ticket.findById(request.params.id)

        if (!ticket) {
            throw new NotFoundError()
        }

        response.status(200).send(ticket)

    })

export { router as showTicketRouter }