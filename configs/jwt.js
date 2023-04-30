const JWT = require('jsonwebtoken');

// added exipresIn parameter in generate function
const generate = (payload, time) =>
{
	return JWT.sign({ user: payload }, process.env.JWT_SECRET, {
		expiresIn: time || '1h'
	});
};

const validate = (token) =>
{
	try
	{
		return JWT.verify(token, process.env.JWT_SECRET) || false;
	} catch (error)
	{
		throw error;
	}
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
