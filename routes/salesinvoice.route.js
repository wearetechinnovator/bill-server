const { add, get, remove, restore, filter, summaryReport } = require("../controllers/salesinvoice.controller");
const router = require("express").Router();


router
  .route("/add")
  .post(add);

router
  .route("/get")
  .post(get);

router
  .route("/delete")
  .delete(remove)

router
  .route("/restore")
  .post(restore)


router
  .route("/filter")
  .post(filter);

router
  .route("/summary-reports")
  .post(summaryReport);


module.exports = router;

