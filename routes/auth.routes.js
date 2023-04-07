const express = require("express");
const router = express.Router();
const { login, register, logout, refreshAccessToken } = require("@controllers/auth.controller");

router.route(`/login`).post(login);
router.route(`/register`).post(register);
router.route(`/logout`).get(logout);
router.route('/refresh').get(refreshAccessToken);

module.exports = router;
