import express, { Request, Response } from "express";
import { body} from 'express-validator'
import jwt from 'jsonwebtoken'

import { BadRequestError } from "@riccardonuzz-org/common";
import { validateRequest } from "@riccardonuzz-org/common";
import { User } from "../models/user.model";
import { PasswordService } from "../services/password.service";

const router = express.Router()

router.post(
    '/api/users/signin',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            throw new BadRequestError('Email does not exist.')
        }

        const passwordsMatch = await PasswordService.compare(existingUser.password, password)

        if (!passwordsMatch) {
            throw new BadRequestError('Incorrect password.')
        }

         // Generate JWT
         const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email
            },
            process.env.JWT_KEY!
        )

        req.session = {
            jwt: userJwt
        }

        res.status(200).send(existingUser)
    })

export { router as signinRouter }
