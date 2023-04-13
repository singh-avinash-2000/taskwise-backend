const Notification = require("@models/notification");
const { getSocket, socketObject } = require("@configs/socket");

exports.sendNotificationToUser = async ({ to, from, event, payload }) =>
{
	try
	{
		const Socket = getSocket();

		const socketId = socketObject[to];
		if (socketId)
		{
			Socket.to(socketId).emit(event, payload);

			await Notification.create({
				to,
				from,
				event,
				payload,
				read: false
			});
		}
	} catch (error)
	{
		console.log(error);
	}
};

exports.sendProjectNotification = async (project_id, from, event, payload) =>
{
	try
	{
		const Socket = getSocket();
		Socket.to(project_id).emit(event, payload);
		await Notification.create({
			project: project_id,
			from,
			event,
			payload,
			read: false
		});
	} catch (error)
	{
		console.log(error);
	}
};
