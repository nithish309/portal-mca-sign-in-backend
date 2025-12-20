import express from "express";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();
const router = express.Router();
const otpStore = {};

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 1 * 60 * 1000; // 1 minute

    otpStore[email] = { otp, expiresAt };

    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_SENDER,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 1 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("SendGrid Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const data = otpStore[email];
  if (!data) return res.status(400).json({ message: "OTP not found" });

  if (Date.now() > data.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (parseInt(otp) === data.otp) {
    delete otpStore[email];
    return res.json({ message: "OTP verified" });
  }

  res.status(400).json({ message: "Invalid OTP" });
});

export default router;
