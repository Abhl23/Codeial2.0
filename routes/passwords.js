const express = require("express");
const router = express.Router();

const passwordsController = require("../controllers/passwords_controller");

router.get("/forgot-password", passwordsController.forgotPassword);

router.post("/reset-link", passwordsController.resetLink);

router.get("/reset-password", passwordsController.resetPassword);

router.post("/update-password", passwordsController.updatePassword);

module.exports = router;
