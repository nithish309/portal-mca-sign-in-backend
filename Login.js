import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Student, Faculty, Guest, Admin } from "./Models.js";

const router = express.Router();
dotenv.config();

// Array of all user collections to check
const userCollections = [
  { model: Student, name: "Student" },
  { model: Faculty, name: "Faculty" },
  { model: Guest, name: "Guest" },
  { model: Admin, name: "Admin" },
];

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;

    for (const col of userCollections) {
      user = await col.model.findOne({ email });
      if (user) break; 
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },//info about user
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: "Login successful",
      token,
      email: user.email,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
