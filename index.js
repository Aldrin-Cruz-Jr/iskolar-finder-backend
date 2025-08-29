const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/Users");
const dotenv = require("dotenv");
// this loads environment variables from a .env file into process.env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
    .then(user => {
        if (user) {
            if (user.password === password) {
                res.json("Success")
            } else {
                res.json("The password is incorrect.")
            }
            res.json(user);
        } else {
            res.status(401).json('No record exists');
        }
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

app.post('/signup', (req, res) => {
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
})