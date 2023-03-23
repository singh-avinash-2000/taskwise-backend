exports.errorHandler = (err, req, res, next) =>
{
	const statusCode = res.statusCode ? res.statusCode : 500;

	console.log(err);
	res.status(statusCode);
	res.json(
		{
			message: err.message,
			error: {
				stack: process.env.NODE_ENV === "production" ? null : err.stack
			}
		});
};
