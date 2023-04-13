const socketIO = require('socket.io');

let io;
let socketObject = {};

function createSocket(server)
{
	io = socketIO(server, {
		cors: {
			origin: 'http://localhost:3000',
			methods: "*",
		}
	});

	io.on('connection', (socket) =>
	{
		socket.on("user-connected", data =>
		{
			socketObject[data] = socket.id;
			console.log(data, "connected");
		});

		socket.on("invite-sent", data =>
		{
			console.log(socket.id);
			console.log(data);
		});

		socket.on('disconnect', () =>
		{
			console.log(socket.id, 'user disconnected');
		});
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
