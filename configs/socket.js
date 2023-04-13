const { Server } = require("socket.io");
const { validate } = require('@configs/jwt');


let io;
let socketObject = {};

function createSocket(server)
{

	io = new Server(server,
		{
			cors: {
				origin: 'http://localhost:3000',
				methods: "*",
			}
		});

	io.use((socket, next) => 
	{
		try
		{
			const accessToken = socket.handshake.auth.token;
			const decoded = validate(accessToken);
			if (decoded)
			{
				socket.userId = decoded.user._id;
				next();
			}
		} catch (error)
		{
			next(new Error(error));
		}
	});

	io.on('connection', async (socket) =>
	{

		console.log(socket.id, 'user connected');
		const userId = socket.userId;
		const socketId = socket.id;
		socketObject[userId] = socketId;

		// socket.on("invite-sent", data =>
		// {
		// 	console.log(socket.id);
		// 	console.log(data);
		// });

		// socket.on('disconnect', () =>
		// {
		// 	console.log(socket.id, 'user disconnected');
		// });
	});

	io.on("error", (error) =>
	{
		console.log(error);
	});
}

function getSocket()
{
	return io;
}

module.exports = {
	createSocket,
	getSocket,
	socketObject
};
