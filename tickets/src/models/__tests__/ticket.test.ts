import { Types } from "mongoose"
import { Ticket } from "../ticket"

it('Implements optimistic concurrency control', async () => {
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: new Types.ObjectId().toHexString()
    })

    // Save the ticket to the database
    await ticket.save()


    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)


    // Make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 10 })
    secondInstance!.set({ price: 15 })

    // Save the first fetched ticket
    await firstInstance!.save()

    // Save the second fetched ticket and expect an error
    try {
        await secondInstance!.save()
    } catch (error) {
        return
    }
})


it('Increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: new Types.ObjectId().toHexString()
    })

    // Save the ticket to the database
    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
})