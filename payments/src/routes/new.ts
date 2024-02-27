import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@riccardonuzz-org/common";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created.publisher";
import { Order } from "../models/order";
import { Payment } from "../models/payments";
import { natsWrapper } from "../nats-wrapper";
// import { stripe } from "../stripe";


const router = Router()
router.post(
    '/api/payments',
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty(),
        body('orderId')
            .not()
            .isEmpty()
    ],
    validateRequest,
    async (request: Request, response: Response) => {
        // const { token, orderId } = request.body
        const { orderId, token } = request.body
        const order = await Order.findById(orderId)

        if (!order) {
            throw new NotFoundError()
        }

        if (order.userId !== request.currentUser!.id) {
            throw new NotAuthorizedError()
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for a cancelled order')
        }

        const payment = Payment.build({
            orderId,
            stripeId: token
        })
        await payment.save()

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment._id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })

        response.status(201).send({ id: payment._id })
    }
)

export { router as createChargeRouter }