const DashboardController = require("../controllers/dashboard.controller");
const router = require("express").Router();



router
    .route("/get-no-enquiry")
    .post(DashboardController.noOfEnqAndTotalEnq);

router
    .route("/get-no-quotation")
    .post(DashboardController.noOfQutAndTotalQut);

router
    .route("/get-no-proforma")
    .post(DashboardController.noOfProformaAndTotalProforma);

router
    .route("/get-no-sales")
    .post(DashboardController.noOfSalesAndTotalSales);

router
    .route("/get-barchart-data")
    .post(DashboardController.getBillCountBarChartData);


module.exports = router;