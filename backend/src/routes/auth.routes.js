import express from 'express';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}
    
router.post("/register", async (req, res) => {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields " });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: "The username should atleast 3 characters long." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be atleast 6 character long." })
        }

        const existedEmail = await User.findOne({ email });
        if (existedEmail) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const existedUser = await User.findOne({ username });
        if (existedUser) {
            return res.status(400).json({ message: "Username already exists." });
        }

        const profileImage = `https://api.dicebear.com/9.x/lorelei/svg?seed=${username}`;

        const user = await User.create({
            username,
            email,
            password,
            profileImage
        })

        await user.save();

        const token = generateToken(user._id)

        return res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        })


    } catch (error) {
        console.log("Internal server error : ", error);
        res.status(500).json({ message: "Internal server error." });
    }

    return res.send("send is working register or signUp")
})

router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields." })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invaild credentials" })
        }

        const comparedPassword = await user.comparePassword(password);
        if (!comparedPassword) {
            return res.status(400).json({ message: "Invalid credentials" })
        }



        res.status(200).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        })
    } catch (error) {
        console.log("Internal server error: ", error);
        res.status(500).json({ message: "Internal server error." });
    }
})

export default router;

