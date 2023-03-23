exports.responseMiddleware = function (req, res, next)
{
	res.success = function (
		{
			result = [],
			code = 200,
			message = "Success"
		})
	{
		res.status(code).send(
			{
				result,
				message
			});
	};

	res.error = function (
		{
			error = {},
			code = 400,
			message = "Server encountered a bad request"
		})
	{
		res.status(code).send(
			{
				error,
				message
			});
	};

	next();
};


// PROJECTS
// --------
// _ID
// NAME
// DESCRIPTION
// CHAT
// TYPE
// DOCUMENT
// STATUS
// MEMBERS : [
// 	{
// 		USER_ID : USER REFERENCE,
// 		ROLE : [ADMIN, OWNER, READ, WRITE]
// 	}
// ]

// TASKS
// -----
// PROJECT_ID,
// TYPE : [MAIN, SUB_TASK],
// SUMMARY
// DESCRIPTION
// ASSIGNEE -> USER_ID
// REPORTER -> USER_ID
// ATTACHMENTS : [{
// 	ID
// 	URL
// }]
// SUB_TASKS : [TASK_ID],
// STATUS;
