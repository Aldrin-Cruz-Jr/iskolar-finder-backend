import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

//initialize express server
const app = express()

//set-up database
mongoose.connect()
    .then(() => console.log('Connected to database'))
    .then((error) => console.log(`Error ${error}`))


//initialize port to express server
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

app.listen(PORT, ()=> {
    console.log(`Running on port ${PORT}`)
})

