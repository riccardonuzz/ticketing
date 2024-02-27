import { Stan, connect as connectToNats } from "node-nats-streaming"

class NatsWrapper {
    private _client?: Stan

    get client(): Stan {
        if (!this._client) {
            throw new Error('Cannot access client before it\'s connection!')
        }

        return this._client
    }

    connenct(clusterId: string, clientId: string, url: string) {
        this._client = connectToNats(clusterId, clientId, { url })

        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Connected to NATS.')
                resolve()
            })

            this.client.on('error', (error) => {
                reject(error)
            })
        })

    }
}

export const natsWrapper = new NatsWrapper()
