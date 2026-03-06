const {
    add, get, remove,
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

module.exports = router;