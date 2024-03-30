const express = require("express");
const router = express.Router();
const authController = require("../controllers/authCtrl");

router.use(authController.auth);

module.exports = router;
