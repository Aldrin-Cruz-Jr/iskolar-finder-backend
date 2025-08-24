import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import userRoutes from './routes/users.mjs';
import dotenv from 'dotenv'

dotenv.config()
//initialize express server
const app = express()

//set-up database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to database'))
    .then((error) => console.log(`Error ${error}`))


//initialize port to express server
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use("/api", userRoutes)
app.listen(PORT, ()=> {
    console.log(`Running on port ${PORT}`)
})

