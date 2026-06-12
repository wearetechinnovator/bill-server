const PoClientController = require("../controllers/poClient.controller");
const router = require("express").Router();


router
  .route("/add")
  .post(PoClientController.add);

router
  .route("/get")
  .post(PoClientController.get);

router
  .route("/update")
  .post(PoClientController.update);

router
  .route("/delete")
  .delete(PoClientController.remove);

router
  .route("/get-sales-invoice")
  .post(PoClientController.getSalesInvoiceByPoNumber);


module.exports = router;