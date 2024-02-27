import { OrderStatus } from "@riccardonuzz-org/common"
import { Types } from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Order } from "../../models/order"
import { Payment } from "../../models/payments"
// import { stripe } from "../../stripe"

// jest.mock('../../stripe')

it('Returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', signin())
        .send({
            token: 'ar23r23qr',
            orderId: new Types.ObjectId().toHexString()
        })
        .expect(404)
})

it('Returns a 401 purchasing an order that doesnt belong to the user', async () => {
    const order = Order.build({
        id: new Types.ObjectId().toHexString(),
        version: 0,
        userId: new Types.ObjectId().toHexString(),
        price: 10,
        status: OrderStatus.Created
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', signin())
        .send({
            token: 'ar23r23qr',
            orderId: order.id
        })
        .expect(401)
})

it('Returns a 400 when purchasing a cancalled order', async () => {
    const userId = new Types.ObjectId().toHexString()

    const order = Order.build({
        id: new Types.ObjectId().toHexString(),
        version: 0,
        userId,
        price: 10,
        status: OrderStatus.Cancelled
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', signin(userId))
        .send({
            token: 'ar23r23qr',
            orderId: order.id
        })
        .expect(400)
})

it('Returns a 204 with valid input', async () => {
    const userId = new Types.ObjectId().toHexString()
    const price = Math.floor((Math.random()) * 100000)

    const order = Order.build({
        id: new Types.ObjectId().toHexString(),
        version: 0,
        userId,
        price,
        status: OrderStatus.Created
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201)

    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    // expect(chargeOptions.source).toEqual('tok_visa')
    // expect(chargeOptions.amount).toEqual(10 * 100)
    // expect(chargeOptions.currency).toEqual('usd')

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: 'tok_visa'
    })

    expect(payment).not.toBeNull()

})