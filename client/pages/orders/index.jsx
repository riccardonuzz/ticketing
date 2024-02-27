import React from 'react'

const OrderIndex = ({ orders }) => {
    const ordersList = orders?.map(order => {
        return (
            <tr key={order.id}>
                <td>{order.ticket.title}</td>
                <td>{order.ticket.price}</td>
                <td className='fw-bold text-uppercase'>{order.status}</td>
            </tr>
        )
    })
    return (
        <div>
            <h1>Orders</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {ordersList}
                </tbody>
            </table>
        </div>
    )
}

OrderIndex.getInitialProps = async (context, client) => {
    try {
        const { data } = await client.get('/api/orders')
        return { orders: data }
    } catch (error) {
        return {}
    }
}

export default OrderIndex