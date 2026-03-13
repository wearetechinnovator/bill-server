const {
    add, get, remove,
    getTotalLoan,
} = require("../controllers/staffPayment.controller");
const router = require("express").Router();


router
    .route("/add")
    .post(add);

router
    .route('/get')
    .post(get);

router
    .route("/delete")
    .delete(remove);

router
    .route("/get-total-loan")
    .post(getTotalLoan);

module.exports = router;