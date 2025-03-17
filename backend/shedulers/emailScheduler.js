import cron from "node-cron";
import User from "../models/user.model.js";
import Weather from "../models/weather.model.js";
import { sendWeatherEmail } from "../lib/utils/emailService.js";

// Function to send emails every 3 hours
export const scheduleWeatherEmails = () => {
    cron.schedule("0 */3 * * *", async () => {
        console.log("Running scheduled weather email task...");

        try {
            const users = await User.find();
            const currentDate = new Date().toISOString().split("T")[0];

            for (const user of users) {
                const weatherReport = await Weather.findOne({ userId: user._id, date: currentDate });

                if (weatherReport) {
                    await sendWeatherEmail(user.email, weatherReport);
                } else {
                    console.log(`No weather report for user ${user.email}`);
                }
            }
        } catch (error) {
            console.error(`Error in scheduled email task: ${error.message}`);
        }
    });
};
