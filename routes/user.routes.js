const express = require("express");
const router = express.Router();
const { fetchUserDetails, updateUserDetails, updateUserProfilePicture } = require("@controllers/user.controller");

router.route(`/`).get(fetchUserDetails);
router.route(`/`).put(updateUserDetails);
router.route(`/`).patch(updateUserProfilePicture);
module.exports = router;
