const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const { responseMiddleware } = require("@middlewares/response.middleware");
const { errorHandler } = require("@middlewares/error.middleware");
const { authenticateRequest } = require("@middlewares/authentication.middleware");

// const cloudinary = require("cloudinary").v2;

const initApp = async (connectDB) =>
{
	try
	{
		await connectDB();

		const app = express();

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

		// cloudinary.config(
		// {
		//     api_key: process.env.CLOUDINARY_API_KEY,
		//     api_secret: process.env.CLOUDINARY_API_SECRET,
		//     secure: true,
		//     use_filename: true,
		//     unique_filename: true
		// });

		app.use(responseMiddleware);
		app.use(express.json());
		app.use(express.urlencoded({ extended: false }));

		app.use(`/api/auth`, require("@routes/auth.routes"));
		app.use(authenticateRequest);
		app.use(`/api/projects`, require("@routes/project.routes"));

		app.use(errorHandler);

		const port = process.env.PORT || 5000;

		await app.listen(port);

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
