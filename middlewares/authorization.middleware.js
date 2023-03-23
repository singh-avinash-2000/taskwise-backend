const authorizeRequest = (asked_permission) =>
{
	return (req, res, next) =>
	{
		const { user } = req;

		if (user?.role?.has_admin_access)
		{
			next();
		}

		const hasPermissions = user.role.permissions;

		if (hasPermissions[asked_permission])
		{
			next();
		}

		const responseObject = {
			code: 403,
			message: "You don't have required permission"
		};

		return res.error(responseObject);
	};
};

module.exports =
{
	authorizeRequest
};
