import nodemailer from "nodemailer";

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail email
        pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
});

// Function to send weather email
export const sendWeatherEmail = async (userEmail, weatherReport) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Your Weather Update",
        html: `
            <h2>Weather Report</h2>
            <p><strong>Date:</strong> ${weatherReport.date}</p>
            <p><strong>Temperature:</strong> ${weatherReport.temperature}°C</p>
            <p><strong>Humidity:</strong> ${weatherReport.humidity}%</p>
            <p><strong>Description:</strong> ${weatherReport.description}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Weather email sent to ${userEmail}`);
    } catch (error) {
        console.error(`Failed to send email: ${error.message}`);
    }
};
