import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Token Not Valid" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Decode Problem" });
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.status(401).json({ message: "Unauthorized Access" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(`Error Protecting Route: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
   