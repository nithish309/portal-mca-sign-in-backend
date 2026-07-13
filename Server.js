import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import signRouter from "./Sign.js";
import otpRouter from "./Otp-generation.js";
import loginRouter from "./Login.js";
import forgetPassRouter from "./Forget-pass.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://mca-portal.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Routes
app.use("/api", otpRouter);
app.use("/api", signRouter);
app.use("/api", loginRouter);
app.use("/api", forgetPassRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running on Render 🚀");
});

// MongoDB connection and server startup
async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log("✅ Connected to MongoDB");

    mongoose.connection.on("connected", () => {
      console.log("📦 MongoDB connection established");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB");
    console.error(err);
    process.exit(1);
  }
}

startServer();
