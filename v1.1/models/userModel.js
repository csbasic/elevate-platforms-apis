const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
let userSchema = new mongoose.Schema(
	{
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		user_image: {
			type: String,
			default: "../assets/images/default-user-image.png",
		},
		email: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		mobile: {
			type: String,
			unique: true,
			index: true,
		},
		password: { type: String },
		profession: { type: String },
		roles: { type: String, default: "user" },
		isBlocked: { type: Boolean, default: false },

		passwordChangeAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		strip_account_id: String,
		stripe_seller: {},
		stripeSession: {},
		status: { type: Number, default: 1 },
	},

	{ timestamps: true }
);

/**
 * 	HASH PASSWORDS
 */
userSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

/**
 * 		COMPARE HASHED PASSWORD
 */
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
	return resetToken;
};

module.exports = mongoose.model("User", userSchema);
