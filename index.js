require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require('morgan');
const path = require("path");
const fs = require('fs');
const router = require("./routes/index.route");

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors())
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('tiny'))
// const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });
// app.use(morgan("tiny", { stream: logStream }));
app.use("/api/v1", router)



app.get("/", (req, res) => {
  res.send({msg:"Hello world"})
})



// create database connection mongoose
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("[*] Database run")

  app.listen(PORT || 8080, () => {
    console.log("[*] Server run", PORT)
  })

}).catch(err => {
  console.error("MongoDB connection error:", err)
});