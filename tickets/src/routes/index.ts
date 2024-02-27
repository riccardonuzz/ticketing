import { requireAuth, validateRequest } from '@riccardonuzz-org/common'
import express, { Request, Response } from 'express'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get(
    '/api/tickets',
    requireAuth,
    validateRequest,
    async (request: Request, response: Response) => {
        const tickets = await Ticket.find({
            orderId: undefined
        })

        response.status(200).send(tickets)
    })

export { router as indexTicketRouter }