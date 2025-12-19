import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "student" },
  clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club", default: [] }],
  participatedEvents: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] },
  ],
});

const facultySchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" ,default: []}],
});
const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});
const guestSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "guest" },
  participatedEvents: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] },
  ],
});
// const studentIntraSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   role: { type: String, default: "studentIntra" },
//   participatedEvents: [
//     { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] },
//   ],
// });

export const Student = mongoose.model("Student", studentSchema);
export const Faculty = mongoose.model("Faculty", facultySchema);
export const Admin = mongoose.model("Admin", adminSchema);
export const Guest = mongoose.model("Guest", guestSchema);
// export const StudentIntra = mongoose.model("StudentIntra", studentIntraSchema);
