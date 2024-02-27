import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

class PasswordService {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex')
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer
        return `${buffer.toString('hex')}.${salt}`
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassowrd, salt] = storedPassword.split('.')
        const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer

        return buffer.toString('hex') === hashedPassowrd
    }
}

export { PasswordService }