const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/Users");
const dotenv = require("dotenv");
// this loads environment variables from a .env file into process.env
dotenv.config();

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

// Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "No record exists" });
        }
        
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        // if Login is Successful
        return res.json({
            success: true,
            message: "Login successful",
            user: { id: user._id, email: user.email },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// SigUp route

app.post('/signup', async (req, res) => {
    try {
        const user = await UserModel.create(req.body);
        res.json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})