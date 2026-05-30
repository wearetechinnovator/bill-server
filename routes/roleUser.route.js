const RoleUserController = require("../controllers/roleUser.controller");
const router = require("express").Router();




router
    .route("/get-all")
    .post(RoleUserController.getAllUser);




module.exports = router;