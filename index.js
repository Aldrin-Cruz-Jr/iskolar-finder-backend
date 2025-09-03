const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/Users");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
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

// Initialize Firebase Admin with the service account
const serviceAccount = require("./iskolarfinder-firebase-service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Middleware: Verity Firebase ID Token
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // This expects the "Bearer <token>"
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid or expired token" })
    }
};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

// SigUp route

app.post('/signup', verifyToken, async (req, res) => {
    try {
        const { name } = req.body;
        const { uid, email } = req.user;

        let user = await UserModel.findOne({ firebaseUid: uid });
        if (user) {
            return res.json({ success: true, user });
        }

        user = await UserModel.create({
            firebaseUid: uid,
            email,
            name,
        });

        res.json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Login Route
app.post("/login", verifyToken, async (req, res) => {
    try {
        const { uid, email } = req.user;

        const user = await UserModel.findOne({ firebaseUid: uid });
        if (!user) {
            return res.status(404).json({ success: false, message: "No record exists" });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: { id: user._id, email: user.email, name: user.name },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET the profile
app.get("/profile", verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;

        const user = await UserModel.findOne({ firebaseUid: uid });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error"});
    }
});



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})