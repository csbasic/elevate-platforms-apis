const express = require("express");
const dbConnect = require("./config/dbConnect");

const { notFound, handleError } = require("./middlewares/errorHandler");

const bodyParser = require("body-parser");
const passport = require("passport");
const googleRouter = require("./routes/googleRoutes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRouter = require("./routes/userRoutes");
const tutorialCategoryRouter = require("./routes/tutorialCategoryRoutes");
const tutorialRouter = require("./routes/tutorialRoutes");
const postRouter = require( "./routes/postRoutes" );
const cookieParser = require( "cookie-parser" );
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;
const passportSetup = require("./utils/passport").default;

dbConnect();

/**
 * 	CREATE TOKEN
 */
app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: "secret",
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI,
			ttl: 12 * 60 * 60,
		}),
	})
);

app.use( cookieParser() );
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.send(`<a href="http://localhost:4000/google">Login With Google</a>`);
});

app.use("/api", userRouter);
app.use("/", googleRouter);
app.use("/api", tutorialCategoryRouter);
app.use("/api", tutorialRouter);
app.use( "/api/v1/", postRouter );

app.use(notFound);
app.use( handleError );



app.listen(PORT, () => {
	console.log(`Server is Running at http://localhost:${PORT}!`);
});
