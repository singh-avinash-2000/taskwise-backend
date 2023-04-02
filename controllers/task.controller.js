const asyncHandler = require("express-async-handler");
const Task = require("@models/task");

exports.fetchTaskForProject = asyncHandler(async (req, res) =>
{
	const { project_id } = req.params;
	const responseObject = {};

	const tasks = await Task.find({ project: project_id });

	responseObject.message = "Successfully fetched all tasks";
	responseObject.result = tasks;

	return res.success(responseObject);
});

exports.fetchTaskDetails = asyncHandler(async (req, res) =>
{
	const { project_id, task_id } = req.params;
	const responseObject = {};

	const taskDetails = await Task.findOne({ project: project_id, _id: task_id });

	responseObject.message = "Successfully fetched task details";
	responseObject.result = taskDetails;
});

exports.addTasktoProject = asyncHandler(async (req, res) =>
{
	const { project_id } = req.params;
	const body = req.body
	const payload = {
		...body,
		project: project_id
	}

	const record = await Task.create(payload)
});
