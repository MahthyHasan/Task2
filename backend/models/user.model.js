import { profile } from "console";
import e from "express";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    profileImg: {
        type: String,
        default: "",
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;