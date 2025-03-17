import { profile } from "console";
import e from "express";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    location: { lat: Number, lon: Number },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;