import { Elements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import useRequest from '../../../hooks/use-request';

const stripePromise = loadStripe('pk_test_51OmJZ4F8RJE7Sy1N58Xdu71ls5ho0lUxEwjo694dWEe0WWJWxdS2HK5OXI45GTQpwuZ7CHpraf6jqNX71yCCZiyT00hGqgniLa');


const OrderComplete = ({ clientSecret, orderId }) => {
    const stripe = useStripe();
    const router = useRouter()
    const [message, setMessage] = useState('')

    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId
        },
        onSuccess: (payment) => console.log(payment)
    })

    const getPaymentIntent = async () => {
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)
        console.log(paymentIntent)
        switch (paymentIntent.status) {
            case "succeeded":
                await doRequest({ token: paymentIntent.id })
                setMessage("Payment succeeded!");
                break;
            case "processing":
                setMessage("Your payment is processing.");
                break;
            case "requires_payment_method":
                setMessage("Your payment was not successful, please try again.");
                break;
            default:
                setMessage("Something went wrong.");
                break;
        }
    }

    useEffect(() => {
        if (!stripe) {
            return;
        }

        if (!clientSecret) {
            return;
        }

        getPaymentIntent()


    }, [stripe]);

    const goBackToMyOrders = () => {
        router.push('/orders')
    }


    return (
        <div>
            <h1>Order completed!</h1>
            <div>
                {message}
            </div>
            <div><button onClick={goBackToMyOrders} className="btn btn-primary mt-2">Go back to my orders</button></div>
        </div>
    )
}

const WrappedOrderComplete = (props) => (
    <Elements stripe={stripePromise} options={{ clientSecret: props.clientSecret }}>
        <OrderComplete {...props} />
    </Elements>
)


WrappedOrderComplete.getInitialProps = (context, client) => {
    return { clientSecret: context.query.payment_intent_client_secret, orderId: context.query.orderId }
}

export default WrappedOrderComplete