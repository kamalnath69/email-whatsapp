// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth()
});

// Generate and display QR code
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// When client is ready
client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

// Send message function
const sendWhatsAppMessage = async (phoneNumber, message) => {
    const chatId = `${phoneNumber}@c.us`;
    await client.sendMessage(chatId, message);
};

client.initialize();

app.post("/send-email", async (req, res) => {
    const { fullname, phone, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "kamalnath9669@gmail.com", // replace with your Gmail address
            pass: "obun fqdy fliq iiqb",  // replace with your Gmail password or app password
        },
    });

    const mailOptions = {
        from: email,
        to: "kamalnath.v2022it@sece.ac.in", // the email where you want to receive the form data
        subject: subject,
        text: `
            My name is ${fullname}.
            My phone number is ${phone}.
            My email address is ${email}.
            Subject: ${subject}.
            Here is my message: ${message}.
        `,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error sending email");
        } else {
            console.log("Email sent: " + info.response);

            // Send WhatsApp message
            const messageBody = `My name is ${fullname}. My phone number is ${phone}. My email address is ${email}. Subject: ${subject}. Here is my message: ${message}.`;

            try {
                await sendWhatsAppMessage('919787867648', messageBody); // replace with the recipient's phone number
                res.status(200).send("Email and WhatsApp message sent successfully");
            } catch (error) {
                console.error("Error sending WhatsApp message:", error);
                res.status(500).send("Error sending email and WhatsApp message");
            }
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
