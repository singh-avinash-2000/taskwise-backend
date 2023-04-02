const asyncHandler = require("express-async-handler");
const JWT = require("@configs/jwt");
const User = require("@models/user");
const Project = require("@models/project");

exports.login = asyncHandler(async (req, res) =>
{
	let responseObject = {};

	const { email, password } = req.body;

	const user = await User.findOne({ email: email.trim() });

	if (!user)
	{
		responseObject.code = 404;
		responseObject.message = "User not found";

		return res.success(responseObject);
	}

	if (user.authenticate(password))
	{
		const token = JWT.generate({
			_id: user._id
		});

		responseObject.message = "Successfully logged in";
		responseObject.result = { token };

		return res.success(responseObject);
	}
	else
	{
		responseObject.message = "Wrong password";

		return res.error(responseObject);
	}
});

exports.register = asyncHandler(async (req, res) =>
{
	let responseObject = {};

	const requestBody = req.body;
	let user = await User.findOne({ email: requestBody.email.trim() });

	if (user)
	{
		responseObject.code = 403;
		responseObject.message = "This email is already registered, please try logging in!";

		return res.error(responseObject);
	}

	let result = await User.create(requestBody);

	responseObject.message = "You have successfully registered!";

	const token = JWT.generate({
		_id: result._id
	});

	responseObject.result = { token };

	return res.success(responseObject);
});

exports.checkValidDisplayName = asyncHandler(async (req, res) => 
{
	let responseObject = {};
	let { display_name } = req.body;

	let user = await User.findOne({ display_name: display_name.trim() });

	if (user)
	{
		responseObject.code = 403;
		responseObject.message = "This display name is already taken, please try another!";

		return res.error(responseObject);
	}

	responseObject.message = "Valid display name";
	return res.success(responseObject);
});
