require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require('morgan');
const router = require("./routes/index.route");
const puppeteer = require("puppeteer");
const attendanceReminder = require("./jobs/staffAttendanceReminder");
const staffAttendancePresent = require("./jobs/staffAttandancePresent");

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);



app.get("/", (req, res) => {
  res.send({ msg: "Hello world" })
})


app.post("/generate-pdf", async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).send('HTML is required');
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setContent(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <style>
          #invoice{
            font-size: 13px !important;
          }
          p+p {
            margin-top: 8px;
          }
          #invoice tr td {
            border: 1px solid #c5c5c5;
            padding: 3px;
            color: black;
            font-size: 10px;
            page-break-inside: avoid;
            line-height: 10px;
          }

          #invoice thead td {
            font-weight: 500;
          }
          .item__table {
            table-layout: fixed;
          }
          .table__wrapper table {
            page-break-inside: avoid;
          }
          .item__table tr td {
            word-wrap: break-word;
          }
          .table__wrapper table.item__table tfoot {
            margin-top: auto;
          }
          table.item__table td {
            max-width: 80mm;
            word-wrap: break-word;
          }
          .discount-font {
            font-size: 8px;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
    `,
    { waitUntil: 'networkidle0' }
  );

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '10mm',
      bottom: '10mm',
      left: '10mm',
      right: '10mm',
    },
  });

  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
  res.setHeader('Content-Length', pdfBuffer.length);

  res.end(pdfBuffer);
});


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