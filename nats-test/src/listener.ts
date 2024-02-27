import { Stan, connect } from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TicketCreatedListener } from './events/ticket-created.listener'

console.clear()

const clientId = randomBytes(4).toString('hex')
const stan: Stan = connect('ticketing', clientId, {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('Listener connected to NATS server.')

    stan.on('close', () => {
        console.log('NATS connection closed!')
        process.exit()
    })

    new TicketCreatedListener(stan).listen()
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
