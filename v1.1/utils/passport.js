const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");

passport.use(
	new GoogleStrategy(
		{
			clientID:
				"535310637142-rrct106sb44vjaep5pijhjhm3sclpppp.apps.googleusercontent.com",
			clientSecret: "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",
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},

		async function (accessToken, refreshToken, profile, callback) {
			console.log(profile);
			let data = profile?._json;
			const user = await User.findOne({ email: data.email });

			if (user) {
				return callback(null, user);
			} else {
				const newUser = await create({
					firstname: data.name,
					lastname: data.given_name,
					user_image: data.picture,
					email: data.email,
					roles: "user",
				});
				return callback(null, newUser);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

module.exports = passport;
