const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const { responseMiddleware } = require("@middlewares/response.middleware");
const { errorHandler } = require("@middlewares/error.middleware");

// const cloudinary = require("cloudinary").v2;

const initApp = async (connectDB) =>
{
	try
	{
		await connectDB();

		const app = express();

		app.use(helmet());
		app.use(cors());

		app.use((req, res, next) =>
		{
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Access-Control-Allow-Methods", "*");
			res.setHeader("Access-Control-Allow-Headers", "*");

			next();
		});

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

		// app.use(`/api/users`, require("@routes/user.routes"));
		// app.use(`/api/species`, require("@routes/species.routes"));
		// app.use(`/api/product-categories`, require("@routes/productCategory.routes"));
		// app.use(`/api/products`, require("@routes/product.routes"));
		// app.use(`/api/orders`, require("@routes/order.routes"));
		// app.use(`/api/misc`, require("@routes/misc.routes"));
		// app.use(`/api/payments`, require("@routes/payments.routes"));

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
