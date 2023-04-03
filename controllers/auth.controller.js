const asyncHandler = require("express-async-handler");
const JWT = require("@configs/jwt");
const User = require("@models/user");
const Project = require("@models/project");

// Logs in the user
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
		// Generating access token here
		const accessToken = JWT.generate({
			_id: user._id
		}, "15s"); //generated accessToken with 1 day expiration time

		// Generating refresh token here
		const refreshToken = JWT.generate({
			_id: user._id
		}, "1d");	// generated refreshToken with 1 year expiration time

		//Added refresh token to cookie
		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			secure: true,
		},);

		responseObject.message = "Successfully logged in";
		responseObject.result = { accessToken };

		return res.success(responseObject);
	}
	else
	{
		responseObject.message = "Wrong password";

		return res.error(responseObject);
	}
});

// Registers a new user
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

	const accessToken = JWT.generate({
		_id: result._id
	}, "1d"); //generated accessToken with 1 day expiration time

	const refreshToken = JWT.generate({
		_id: result._id
	}, "1y");	// generated refreshToken with 1 year expiration time

	//Added refresh token to cookie
	res.cookie('jwt', refreshToken, {
		httpOnly: true,
		secure: true,
	});

	responseObject.result = { accessToken };

	return res.success(responseObject);
});


//Logs out the user by clearing the cookie
exports.logout = asyncHandler(async (req, res) =>
{
	let responseObject = {};
	res.clearCookie('jwt', {
		httpOnly: true,
		secure: true,
	});
	responseObject.message = "Successfully logged out";
	return res.success(responseObject);
});

//Checks if the user is already registered
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

//Refresh Access Token after Access Token expires
exports.refreshAccessToken = asyncHandler(async (req, res) =>
{
	let responseObject = {};

	const { jwt } = req.cookies;

	if (jwt)
	{
		const decoded = JWT.validate(jwt);

		if (decoded)
		{
			const accessToken = JWT.generate({
				_id: decoded._id
			}, "1d"); //generated accessToken with 1 day expiration time

			responseObject.message = "Successfully refreshed access token";
			responseObject.result = { accessToken };

			return res.success(responseObject);
		}
		else
		{
			responseObject.code = 401;
			responseObject.message = "Invalid refresh token";

			return res.error(responseObject);
		}
	}
	else
	{
		responseObject.code = 401;
		responseObject.message = "Invalid refresh token";

		return res.error(responseObject);
	}
});
