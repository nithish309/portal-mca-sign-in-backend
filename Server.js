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

// Global CORS
app.use(cors({
  origin: "https://mca-portal.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

const port = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error:", err));

// Routes
app.use("/api", otpRouter);
app.use("/api", signRouter);
app.use("/api", loginRouter);
app.use("/api", forgetPassRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running on Render 🚀");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
