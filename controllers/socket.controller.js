exports.registerSocketEvents = (socket) =>
{
	socket.on("add-to-project", (payload) =>
	{
		console.log(payload);
	});
};
