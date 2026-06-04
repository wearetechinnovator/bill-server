const { add, get, remove, restore, filter,
  getMonthWisePaymentOut, getCashOut, getPaymentNo
} = require("../controllers/paymentout.controller");
const router = require("express").Router();


router
  .route("/add")
  .post(add);

router
  .route("/get")
  .post(get);

router
  .route("/get-payment-no")
  .post(getPaymentNo);

router
  .route("/delete")
  .delete(remove);


router
  .route("/restore")
  .post(restore);


router
  .route("/filter")
  .post(filter);

router
  .route("/month-wise")
  .post(getMonthWisePaymentOut);


router
  .route("/get-cashout")
  .post(getCashOut);


module.exports = router;

