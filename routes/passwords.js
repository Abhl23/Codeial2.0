const express = require("express");
const router = express.Router();

const passwordsController = require("../controllers/passwords_controller");

router.get("/forgot-password", passwordsController.forgotPassword);

module.exports = router;
