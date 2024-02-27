import { Schema, Model, Document, model } from 'mongoose'
import { PasswordService } from '../services/password.service'

interface UserAttrs {
    email: string,
    password: string
}

interface UserDocument extends Document, UserAttrs {
    createdAt: string,
    updatedAt: string
}

interface UserModel extends Model<UserDocument> {
    build(attrs: UserAttrs): UserDocument
}


const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.password
            delete ret.__v
        }
    }
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await PasswordService.toHash(this.get('password'))
        this.set('password', hashed)
    }

    done()
})


const User = model<UserDocument, UserModel>('User', userSchema)

export { User }