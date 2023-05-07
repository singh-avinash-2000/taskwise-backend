const Notification = require("@models/notification");
const { getSocket, getSocketObject } = require("@configs/socket");

exports.sendNotificationToUser = async ({ to, event, payload }) =>
{
	try
	{
		const Socket = getSocket();
		const socketObject = getSocketObject();

		if (socketObject[to])
		{
			Socket.to(socketObject[to]).emit(event, payload);
		}

		await Notification.create({
			user: to,
			type: "USER",
			payload
		});
	} catch (error)
	{
		console.log(error);
	}
};

exports.sendProjectNotification = async ({ to, event, payload, initiator }) =>
{
	try
	{
		// Broadcast event in a room
		const Socket = getSocket();
		const socketObject = getSocketObject();
		const initiatorSocket = Socket.sockets.sockets.get(socketObject[initiator]);
		initiatorSocket.to(to).emit(event, payload);

		await Notification.create({
			type: "PROJECT",
			project: to,
			payload
		});
	} catch (error)
	{
		console.log(error);
	}
};
