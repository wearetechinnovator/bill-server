const ReportController = require("../controllers/report.controller");
const router = require("express").Router();



router
    .route("/daybook")
    .post(ReportController.dayBook);


module.exports = router;
