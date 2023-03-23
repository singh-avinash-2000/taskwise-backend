const JWT = require('jsonwebtoken');

const generate = (user) =>
{
	return JWT.sign({ user }, process.env.JWT_SECRET);
};

const validate = (token) =>
{
	return JWT.verify(token, process.env.JWT_SECRET);
};

const validateRequestHeader = (authHeader) =>
{
	if (!authHeader)
	{
		return undefined;
	}

	const authTokenList = authHeader.split(' ');

	if (authTokenList.length !== 2)
	{
		return undefined;
	}

	return validate(authTokenList[1]);
};

module.exports = {
	generate, validate, validateRequestHeader
};
