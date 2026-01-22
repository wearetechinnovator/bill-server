const router = require("express").Router();
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
router.use("/partycategory/", partyCategoryRoute);
router.use("/staff/", staffRoute);
router.use("/attendance/", attendanceRoute);






module.exports = router;