const asyncHandler = require("express-async-handler");
const Project = require("@models/project");

exports.fetchProjectListForUser = asyncHandler(async (req, res) =>
{
	const { _id } = req.user;
	const responseObject = {};

	const records = await Project.find({
		"members.user": _id,
		status: "ACTIVE"
	});

	responseObject.message = "Successfully pulled all projects";
	responseObject.result = records || [];

	return res.success(responseObject);
});

exports.createNewProject = asyncHandler(async (req, res) =>
{
	console.log(req.user);
	const { _id } = req.user;
	const body = req.body;
	const responseObject = {};

	body.members = [
		{
			user: _id,
			role: "OWNER"
		}
	];

	await Project.create(body);

	responseObject.message = "Successfully add a new project";
	res.success(responseObject);
});

exports.fetchProjectDetails = asyncHandler(async (req, res) =>
{
	const { _id } = req.user;
	const { project_id } = req.params;
	const responseObject = {};

	const record = await Project.findOne({
		_id: project_id,
		"members.user": _id
	});

	if (!record)
	{
		responseObject.message = "Invalid project id";
		return res.error(responseObject);
	}

	responseObject.message = "Successfully fetch project details";
	responseObject.result = record;

	return res.success(responseObject);
});

exports.updateProjectDetails = asyncHandler(async (req, res) =>
{
	const { _id } = req.user;
	const { project_id } = req.params;
	const responseObject = {};

	const payload = req.body;

	const record = await Project.findOneAndUpdate(
		{ _id: project_id, "members.user": _id, "members.role": { $in: ["ADMIN", "OWNER"] } },
		payload,
		{ new: true }
	);

	if (!record)
	{
		responseObject.message = "Invalid project id";
		return res.error(responseObject);
	}

	responseObject.message = "Successfully updated project details";

	return res.success(responseObject);
});

exports.deleteProject = asyncHandler(async (req, res) =>
{
	const { _id } = req.user;
	const { project_id } = req.user;

	const record = await findOneAndUpdate({ _id: project_id, "members.user": _id, "members.role": "OWNER" }, { status: "DELETED" }, { new: true });

	if (!record)
	{
		return res.error(responseObject);
	}

	responseObject.message = "Successfully deleted project";
	responseObject.result = record;

	return res.success(responseObject);
});

exports.fetchProjectMembers = asyncHandler(async (req, res) =>
{
	const { _id } = req.user;
	const { project_id } = req.params;
	const responseObject = {};

	const record = await Project.findOne({
		_id: project_id,
		"members.user": _id
	}).populate({ path: "members.user" });

	if (!record)
	{
		responseObject.message = "Invalid project id";
		return res.error(responseObject);
	}

	responseObject.message = "Successfully fetched member details";
	responseObject.result = record.members;
});

exports.addMemberToProject = asyncHandler(async (req, res) =>
{
	const { _id } = req.user;
	const { project_id } = req.params;
	const responseObject = {};
	const body = req.body;

	const record = await Project.findByIdAndUpdate(
		{ _id: project_id, "members.user": _id, "members.role": { $in: ["ADMIN", "OWNER"] } },
		{ $push: { members: { user: body.id, role: body.role || "READ" } } },
		{ new: true }
	);

	if (!record)
	{
		responseObject.message = "Invalid project id";
		return res.error(responseObject);
	}

	responseObject.message = "Successfully add member to project";
	responseObject.result = record.members;
});

exports.removeMemberFromProject = asyncHandler(async (req, res) =>
{
	const { _id } = req.user;
	const { project_id, user_id } = req.params;
	const responseObject = {};

	const record = await Project.findByIdAndUpdate(
		{ _id: project_id, "members.user": _id, "members.role": { $in: ["ADMIN", "OWNER"] } },
		{ $pull: { members: { user: user_id } } },
		{ new: true }
	);

	if (!record)
	{
		responseObject.message = "Invalid project id";
		return res.error(responseObject);
	}

	responseObject.message = "Successfully removed member from project";
	responseObject.result = record.members;
});

exports.updateProjectMemberDetails = asyncHandler(async (req, res) =>
{
	// const { _id } = req.user;
	const { project_id, user_id } = req.params;
	const body = req.body;
	const responseObject = {};

	const record = await Project.findOneAndUpdate(
		{ _id: project_id, 'users.user': user_id },
		{ $set: { 'users.$.role': body.new_role } },
		{ new: true }
	);

	if (!record)
	{
		responseObject.message = "Invalid project id";
		return res.error(responseObject);
	}

	responseObject.message = "Successfully removed member from project";
	responseObject.result = record.members;

	return res.success(responseObject);
});

// {
// 	user : {
// 		user_object
// 	},
// 	projects : {
// 		_id : "OWNER",
// 		_id : "ADMIN",
// 		_id : "READ",
// 	}
// }

// hasProjectAccess()
// {
// 	const{project_id} = req.params
// 	return Boolean(projects[project_id])
// }


// hasPermissions(permission)
// {
// 	const {project_id} = req.params
// 	return projects[project_id] === permission
// }
