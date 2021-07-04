const express = require("express");
const router = express.Router();
const checkAuth = require('../Middlewares/CheckAuth');

const userControllers = require('../Controllers/User');

router.post("/change_password", checkAuth, userControllers.user_change_password);

module.exports = router;