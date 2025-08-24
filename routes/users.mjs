import {Router} from 'express'
import {User} from '../mongoose/schema/user.mjs'
import bycrypt from 'bcrypt'

const router = Router()

//signup route

router.post("/users", async(request, response) => {
    console.log("Request body", request.body)
    const {email, password} = request.body

    try {
        const hashPassword = await bycrypt.hash(password, 10)
        const newUser = new User({ ...request.body, password: hashPassword})
        const savedUser = await newUser.save()
        console.log("user saved")
        return response.status(200).send(savedUser)
    } catch (error) {
        return response.sendStatus(400)
    }
}) 