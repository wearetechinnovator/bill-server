require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require('morgan');
const router = require("./routes/index.route");
const attendanceReminder = require("./jobs/staffAttendanceReminder");
const staffAttendancePresent = require("./jobs/staffAttandancePresent");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'barcodes')));
app.use("/api/v1", router);


app.get("/ping", (req, res) => res.send({ msg: "PONG" }));



// create database connection mongoose
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("[*] Database run");

  attendanceReminder(); //Staff Attendance Reminder Mail;
  staffAttendancePresent(); // Default Presend Attendance;

  app.listen(PORT || 8080, () => {
    console.log("[*] Server run", PORT)
  })

}).catch(err => {
  console.error("MongoDB connection error:", err)
});