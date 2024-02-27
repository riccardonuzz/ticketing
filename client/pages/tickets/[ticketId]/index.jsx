import Router from 'next/router'
import React from 'react'
import useRequest from '../../../hooks/use-request'

const TicketShow = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket?.id
        },
        onSuccess: (order) => Router.push('/orders/[orderid]', `/orders/${order.id}`)
    })

    return (
        <div>
            <h1>{ticket?.title}</h1>
            <h4>Price: {ticket?.price}</h4>
            {
                errors?.length > 0 &&
                <div className="alert alert-danger mt-2">
                    <h4>Oooops...</h4>
                    <ul className='my-0'>
                        {errors.map(error => <li key={error.message}>{error.message}</li>)}
                    </ul>
                </div>
            }
            <button onClick={() => doRequest()} className='btn btn-primary'>Purchase</button>
        </div>
    )
}

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query
    try {
        const { data } = await client.get(`/api/tickets/${ticketId}`)
        return { ticket: data }
    } catch (error) {
        return {}
    }

}

export default TicketShow