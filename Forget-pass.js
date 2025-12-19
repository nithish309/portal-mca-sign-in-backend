import express from "express";
import bcrypt from "bcryptjs";
import { Student, Faculty, Guest, Admin } from "./Models.js";//studentIntra

const router = express.Router();

const userTypeStore = {}; 
// Array of all user collections to check
const userCollections = [
  { model: Student, name: "Student" },
  { model: Faculty, name: "Faculty" },
  { model: Guest, name: "Guest" },
  { model: Admin, name: "Admin" },
];
router.post("/forget-password/check", async (req, res) => {
  const { email } = req.body;

  try {
    let userType = null;
    let user = null;

   for (const col of userCollections) {
      user = await col.model.findOne({ email });
      if (user){ 
      userType = col.name;
      break;
      }
    }

    if (!user) {
      return res.status(404).json({ message: "Email does not exist" });
    }
 

    userTypeStore[email] = userType;

    res.json({
      message: "Email found. Proceed to reset password",
      userType, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forget-password/update", async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    let userType = userTypeStore[email];

    let updatedUser = null;
    userType = userType.toLowerCase();
    if (userType === "student" || userType === "studentIntra") {
      updatedUser = await Student.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    } else if (userType === "faculty") {
      updatedUser = await Faculty.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    } else if (userType === "guest") {
      updatedUser = await Guest.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    }else if (userType === "admin") {
      updatedUser = await Admin.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    delete userTypeStore[email];

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating password" });
  }
});

export default router;
