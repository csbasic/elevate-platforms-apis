const googleRouter = require("express").Router();
const passport = require("passport");
const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");

googleRouter.get(
	"/login/success",
	expressAsyncHandler(async (req, res) => {
		if (req.user) {
			const fetchedUser = await User.findOne({ email: req.user.email });
			if (fetchedUser) {
				res.status(200).json({
					status: true,
					message: "Logged In Successfully!",
					token: generateToken(fetchedUser?._id),
					role: fetchedUser?.roles,
					username: fetchedUser?.firstname + " " + fetchedUser?.lastname,
					userimage: fetchedUser?.user_image,
					from: "Google",
				});
			}
		} else {
			throw new Error("Something Went Wrong!");
		}
	})
);

/**
 * 	LOGIN
 */
googleRouter.get(
	"/login/failed",
	expressAsyncHandler(async (req, res) => {
		res.status(401).json({
			status: false,
			message: "Login Failed!",
		});
	})
);

googleRouter.get(
	"/google",
	passport.authenticate("google", ["profile", "email"])
);

googleRouter.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		successRedirect: "/login/success",
		failureRedirect: "/login/failed",
	})
);

/**
 * 	LOGOUT
 */
googleRouter.get(
	"/logout",
	expressAsyncHandler(async (req, res) => {
		req.logOut();
		res.redirect("/");
	})
);

module.exports = googleRouter;
