const DarController = require("../controllers/dar.controller");
const router = require("express").Router();



router
    .route("/add")
    .post(DarController.createDar);

router
    .route("/get-dar-with-history")
    .post(DarController.getSingleDarWithHistory);

router
    .route("/get-all")
    .post(DarController.getAllDar);

router
    .route("/add-history")
    .post(DarController.addDarHistory);


module.exports = router;
