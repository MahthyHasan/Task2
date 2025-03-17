import { generateTokenandSetCookie } from "../lib/utils/generatTokens.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async(req, res) => {
    try {
        const { username, fullname, email, password, role } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email Already Exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            fullname,
            email,
            password: passwordHash,
            role,
        });
        
        if(newUser) {
            generateTokenandSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role,
                profileImg: newUser.profileImg,
            });
        } else {
            return res.status(400).json({ message: "User Creation Failed" });
        }


    } catch (error) {
        console.error(`Error Signing Up Controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
        
    };
}

export const logIn = async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const isMatch = await bcrypt.compare(password, user?.password || "");
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        generateTokenandSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            profileImg: user.profileImg,
        });

    } catch (error) {
        console.error(`Error Log in Controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logOut = async(req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
        });
        res.status(200).json({ message: "Logged Out" });
    } catch (error) {
        console.error(`Error Log Out Controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
        
    }   
}

export const getUser = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
        
    } catch (error) {
        console.error(`Error Get User Controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });        
    }

}