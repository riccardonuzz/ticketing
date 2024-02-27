import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useRef, useState } from 'react'
import CheckoutForm from '../../../components/CheckoutForm';

const stripePromise = loadStripe('pk_test_51OmJZ4F8RJE7Sy1N58Xdu71ls5ho0lUxEwjo694dWEe0WWJWxdS2HK5OXI45GTQpwuZ7CHpraf6jqNX71yCCZiyT00hGqgniLa');


const OrderShow = ({ order, clientSecret }) => {
    const [expiration, setExpiration] = useState(0)
    const [errors, setErrors] = useState(null)
    const timerIdRef = useRef(null)


    const stripeOptions = {
        clientSecret
    }

    useEffect(() => {
        const findTimeLeft = () => {
            const currentFormatDate = new Date(order?.expiresAt)

            // @ts-ignore
            const msLeft = currentFormatDate.setHours(currentFormatDate.getHours()) - Date.now()
            setExpiration(Math.round(msLeft / 1000))
        }

        findTimeLeft()
        timerIdRef.current = setInterval(findTimeLeft, 1000)

        return () => {
            clearInterval(timerIdRef.current)
        }

    }, [])

    if (expiration <= 0) {
        clearInterval(timerIdRef.current)
        return <div>Order expired.</div>
    }

    return (
        <>
            <div className='mt-2 mb-2'>Time left to pay: {expiration} seconds.</div>
            {
                clientSecret &&
                <Elements stripe={stripePromise} options={stripeOptions}>
                    <CheckoutForm orderId={order.id} setErrors={setErrors} />
                </Elements>
            }
            {
                errors?.length > 0 &&
                <div className="alert alert-danger mt-2">
                    <h4>Oooops...</h4>
                    <ul className='my-0'>
                        {errors.map(error => <li key={error.message}>{error.message}</li>)}
                    </ul>
                </div>
            }
        </>
    )
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query
    try {
        const { data } = await client.get(`/api/orders/${orderId}`)
        console.log("ORDER: ", data)
        const intentData = await client.post(`/api/payments/create-payment-intent`, { orderId })
        console.log("INTENTDATA: ", intentData.data)
        return { order: data, clientSecret: intentData.data.clientSecret }
    } catch (error) {
        console.log(error.message)
        return {}
    }

}

export default OrderShow