const { get, getPartyBalance } = require("../controllers/ladger.controller");
const router = require("express").Router();


router
    .route("/get")
    .post(get);

router
    .route("/get-party-balance")
    .post(getPartyBalance);

module.exports = router;