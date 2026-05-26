const router = require("express").Router();
const puppeteer = require("puppeteer");

const userRoute = require("./user.route");
const companyRoute = require('./company.route');
const partyRoute = require("./party.route");
const taxRoute = require("./tax.route");
const unitRoute = require('./unit.route');
const categoryRoute = require('./category.route');
const itemRoute = require('./item.route');
const quotationRoute = require('./quotation.route');
const proformaRoute = require('./proforma.route');
const poRoute = require('./po.route');
const purchaseInvoiceRoute = require("./purchaseinvoice.route");
const purchaseReturnRoute = require("./purchasereturn.route");
const debitNoteRoute = require("./debitnote.route");
const salesiInvoiceRoute = require("./salesinvoice.route");
const salesReturnRoute = require("./salesreturn.route");
const creditNoteRoute = require("./creditnote.route");
const deliveryChalan = require("./deliverychalan.route");
const paymentIn = require("./paymentin.route");
const paymentOut = require("./paymentout.route");
const accountRoute = require("./account.route");
const otherTrancationRoute = require("./transaction.route");
const partyCategoryRoute = require("./partycategory.route");
const staffRoute = require("./staff.route");
const attendanceRoute = require("./attendance.route");
const ladgerRoute = require("./ladger.route");
const transactionCategoryRoute = require("./transactionCategory.route");
const staffPaymentRoute = require("./staffPayment.route");
const tdsRateRoute = require("./tdsRate.route");



router.use("/user/", userRoute);
router.use("/company/", companyRoute);
router.use("/party/", partyRoute);
router.use("/tax/", taxRoute);
router.use("/unit/", unitRoute);
router.use("/category/", categoryRoute);
router.use("/item/", itemRoute);
router.use("/quotation/", quotationRoute);
router.use("/proforma/", proformaRoute);
router.use("/po/", poRoute);
router.use("/purchaseinvoice/", purchaseInvoiceRoute);
router.use("/purchasereturn/", purchaseReturnRoute);
router.use("/debitnote/", debitNoteRoute);
router.use("/salesinvoice/", salesiInvoiceRoute);
router.use('/salesreturn/', salesReturnRoute);
router.use('/creditnote/', creditNoteRoute);
router.use('/deliverychalan/', deliveryChalan);
router.use('/paymentin/', paymentIn);
router.use('/paymentout/', paymentOut);
router.use('/account/', accountRoute);
router.use("/other-transaction/", otherTrancationRoute);
router.use("/transaction-category/", transactionCategoryRoute);
router.use("/partycategory/", partyCategoryRoute);
router.use("/staff/", staffRoute);
router.use("/attendance/", attendanceRoute);
router.use("/ladger/", ladgerRoute);
router.use("/staff-payment/", staffPaymentRoute);
router.use("/tds-rate/", tdsRateRoute);



router.post("/generate-pdf", async (req, res) => {
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
          .cancel__invoice {
            position: absolute;
            color: rgba(255, 0, 0, 0.295);
            text-transform: uppercase;
            font-size: 7rem;
            transform: rotate(-50deg);
            top: 220px;
            left: 90px;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
    `,
    {
      waitUntil: ['load', 'domcontentloaded'],
      timeout: 60000
    }
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




module.exports = router;