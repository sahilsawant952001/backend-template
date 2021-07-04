const express = require("express");
const router = express.Router();

const authControllers = require("../Controllers/Auth");

router.post("/signin", authControllers.auth_signin);

router.post("/signup", authControllers.auth_signup);

module.exports = router;