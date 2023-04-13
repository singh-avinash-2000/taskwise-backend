const asyncHandler = require("express-async-handler");
const User = require("@models/user");

exports.fetchUserDetails = asyncHandler(async (req, res) =>
{
	const { _id } = req.user;
	const user = await User.findById(_id).select("_id display_name first_name last_name email");

	const responseObject = {
		message: "Successfully fetched user details",
		result: user
	};

	return res.success(responseObject);
});
