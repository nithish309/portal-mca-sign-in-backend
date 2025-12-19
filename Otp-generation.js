import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const otpStore = {};

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    const expiresAt = Date.now() + 1 * 60 * 1000;
    otpStore[email] = { otp, expiresAt };

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 1 minute.`,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const otpData = otpStore[email];
  if (!otpData) {
    return res.status(400).json({ message: "No OTP sent to this email" });
  }
  if (Date.now() > otpData.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }
  if (otpStore[email] && parseInt(otp) === otpStore[email].otp) {
    delete otpStore[email];
    return res.json({ message: "OTP verified" });
  }
  return res.status(400).json({ message: "Invalid OTP" });
});

export default router;
