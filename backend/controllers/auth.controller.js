import { generateTokenandSetCookie } from "../lib/utils/generatTokens.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import Weather from "../models/weather.model.js";

// Sign Up
export const signUp = async (req, res) => {
    try {
        const { username, email, password, location } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
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
            email,
            password: passwordHash,
            location
        });

        if (newUser) {
            generateTokenandSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                location: newUser.location,
            });
        } else {
            return res.status(400).json({ message: "User Creation Failed" });
        }
    } catch (error) {
        console.error(`Error Signing Up Controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// login
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
            email: user.email,            
            location: user.location,
        });

    } catch (error) {
        console.error(`Error Log in Controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Log Out
export const logOut = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out" });
    } catch (error) {
        console.error(`Error Log Out Controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get User
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.error(`Error Get User Controller: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update User Location
export const updateUserLocation = async (req, res) => {
    try {
        const { lat, lon } = req.body;
        if (lat === undefined || lon === undefined) {
            return res.status(400).json({ message: "Latitude and Longitude are required" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { location: { lat, lon } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(`Error Updating User Location: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getUserWeather = async (req, res) => {
    try {
        const { id, date } = req.params;

        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Retrieve stored weather report for the given user and date
        const weatherReport = await Weather.findOne({ userId: id, date });

        if (!weatherReport) {
            return res.status(404).json({ message: "No weather report found for this date" });
        }

        res.status(200).json(weatherReport);
    } catch (error) {
        console.error(`Error fetching user weather: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
