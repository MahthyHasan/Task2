import mongoose from "mongoose";

const weatherSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: String, // Format: YYYY-MM-DD
            required: true,
        },
        temperature: Number,
        humidity: Number,
        description: String,
    },
    { timestamps: true }
);

const Weather = mongoose.model("Weather", weatherSchema);

export default Weather;
