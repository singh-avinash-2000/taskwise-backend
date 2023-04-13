const express = require("express");
const router = express.Router();
const { fetchUserDetails } = require("@controllers/user.controller");

router.route(`/`).get(fetchUserDetails);

module.exports = router;
