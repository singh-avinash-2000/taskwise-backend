const asyncHandler = require("express-async-handler");
const User = require("@models/user");

exports.fetchUserDetails = asyncHandler(async (req, res) =>
{
	const { _id } = req.user;
	const user = await User.findById(_id).select("-salt -encrypted_password");
	const responseObject = {
		message: "Successfully fetched user details",
		result: user
	};

	return res.success(responseObject);
});

exports.updateUserDetails = asyncHandler(async (req, res) =>
{

	let responseObject = {};
	const { _id } = req.user;
	const { email, first_name, last_name, display_name } = req.body;

	if (!email || !first_name || !last_name || !display_name) 
	{
		responseObject.message = "All fields are required";
		return res.error(responseObject);
	}

	const user = await User.findById(_id);
	user.email = email;
	user.first_name = first_name;
	user.last_name = last_name;
	user.display_name = display_name;
	await user.save();

	responseObject = {
		message: "Successfully updated user details",
		result: user
	};

	return res.success(responseObject);
});

exports.updateUserProfilePicture = asyncHandler(async (req, res) =>
{
	let responseObject = {};
	const { _id } = req.user;
	const { profile_picture } = req.body;

	if (!profile_picture)
	{
		responseObject.message = "Profile picture is required";
		return res.error(responseObject);
	}

	const user = await User.findById(_id);
	user.profile_picture = profile_picture;
	await user.save();

	responseObject = {
		message: "Successfully updated user profile picture",
		result: user
	};

	return res.success(responseObject);
});
