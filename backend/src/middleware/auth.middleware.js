import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// const response = await fetch('https://localhost:3000/api/books/', {
//     method: 'POST',
//     body: JSON.stringify({
//         title,
//         caption,
//     }),
//     headers: { Authorization: `Bearer ${token}` }
// })

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "No authentication token, access denied" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //find the user
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User is invalid" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in auth middleware", error);
        res.status(401).json({ message: error.message });

    }
}