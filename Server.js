import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import signRouter from "./Sign.js";
import otpRouter from "./Otp-generation.js";
import loginRouter from "./Login.js";
import forgetPassRouter from "./Forget-pass.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const url=process.env.MONGODB_URI;

mongoose.connect(url)
.then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to MongoDB:", error);
});

app.use("/api", otpRouter);
app.use("/api", signRouter);
app.use("/api", loginRouter);
app.use("/api", forgetPassRouter);

app.get("/", (req, res) => {
  res.send("Sign-in backend running on Render 🚀");
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);

});