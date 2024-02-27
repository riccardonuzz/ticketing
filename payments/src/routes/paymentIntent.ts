import { NotFoundError, requireAuth, validateRequest } from '@riccardonuzz-org/common';
import { Router, Response, Request } from 'express';
import { body } from 'express-validator';
import { stripe } from './../stripe';
import { Order } from '../models/order';

const router = Router()


router.post(
    '/api/payments/create-payment-intent',
    requireAuth,
    [
        body('orderId')
            .not()
            .isEmpty()
    ],
    validateRequest,
    async (request: Request, res: Response) => {
        const { orderId } = request.body;

        const order = await Order.findById(orderId)

        console.log("INTENT", order)

        if (!order) {
            throw new NotFoundError()
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: order.price * 100,
            currency: "eur",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    });

export { router as paymentIntentRouter }