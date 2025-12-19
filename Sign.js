import express from "express";
import bcrypt from "bcryptjs";
import { Student, Faculty, Guest, Admin } from "./Models.js"; //studentIntra
const router = express.Router();
// Array of all user collections to check
const userCollections = [
  { model: Student, name: "Student" },
  { model: Faculty, name: "Faculty" },
  { model: Guest, name: "Guest" },
  { model: Admin, name: "Admin" },
];
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let userType;
    let role;

    const studentRegex = /^[a-z]+\.([0-9]{2})mca@kongu\.edu$/i;
    const facultyRegex = /^[a-z]+(@kongu\.ac\.in|\.mca@kongu\.edu)$/i;
    const studentIntraRegex = /^[a-z]+\.([0-9]{2})[a-z]{3}@kongu\.edu$/i;
    // const adminRegex = /^nithishchinnasamy91@gmail\.com$/;

    if (studentRegex.test(email)) {
      role = "student";
    } else if (facultyRegex.test(email)) {
      role = "faculty";
      // } else if (adminRegex.test(email)) {
      //   role = "admin";
    } else if (studentIntraRegex.test(email)) {
      role = "studentIntra";
    } else {
      role = "guest";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let existingUser = null;

    for (const col of userCollections) {
      existingUser = await col.model.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
    }

    //  Create new user based on the type you want to register
    let user;

    switch (role) {
      case "student":
        user = new Student({ name, email, password: hashedPassword, role });
        break;
      case "studentIntra":
        user = new Student({ name, email, password: hashedPassword, role });
        break;
      case "faculty":
        user = new Faculty({ name, email, password: hashedPassword, role });
        break;
      case "admin":
        user = new Admin({ name, email, password: hashedPassword, role });
        break;
      default:
        user = new Guest({ name, email, password: hashedPassword, role });
    }
    await user.save();
    res.status(201).json({ message: "registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
