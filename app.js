require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const { responseMiddleware } = require("@middlewares/response.middleware");
const { errorHandler } = require("@middlewares/error.middleware");
const { authenticateRequest } = require("@middlewares/authentication.middleware");
const { Server } = require("socket.io");
const { registerSocketEvents } = require("@controllers/socket.controller");

var SocketUsers = {};

const initApp = async (connectDB) =>
{
	try
	{
		await connectDB();

		const app = express();
		const httpServer = createServer(app);
		const io = new Server(httpServer, {
			cors: {
				origin: 'http://localhost:3000',
				methods: "*",
			}
		});

		app.use(helmet());
		app.use(cookieParser());

		//For CORS
		let origin = 'http://localhost:3000';
		if (process.env.NODE_ENV === 'production')
		{
			origin = process.env.CORS_ORIGIN;
		}

		app.use(cors({
			origin,
			credentials: true
		}));

		app.use((req, res, next) =>
		{
			res.setHeader("Access-Control-Allow-Methods", "*");
			res.setHeader("Access-Control-Allow-Headers", "*");
			next();
		});

		app.use(morgan('short'));

		app.use(responseMiddleware);
		app.use(express.json({ limit: '10mb' }));
		app.use(express.urlencoded({ extended: false }));

		app.use(`/api/auth`, require("@routes/auth.routes"));
		app.use(authenticateRequest);
		app.use(`/api/projects`, require("@routes/project.routes"));
		app.use(`/api/misc`, require("@routes/misc.routes"));

		app.use(errorHandler);

		const port = process.env.PORT || 5000;

		io.on("connection", (socket) =>
		{
			console.log("someone-connected", socket.id);
			socket.on("user-connected", data =>
			{
				SocketUsers[data] = socket.id;
				console.log(SocketUsers);

				socket.emit("add-to-project", {
					message: "you have been invited to a new project",
					count: Math.ceil(Math.random() * 10)
				});
			});

			socket.on("disconnect", () =>
			{
				console.log(socket.id, "disconnected");
			});

			registerSocketEvents(socket);
		});

		await httpServer.listen(port);

		console.log(`server started at -> http://localhost:${port}`);

		return app;
	}
	catch (err)
	{
		console.log(err);
		console.log("ERROR STARTING SERVER");
	}
};

module.exports =
{
	initApp
};
