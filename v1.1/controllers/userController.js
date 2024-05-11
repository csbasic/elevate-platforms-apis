const { generateToken } = require("../config/jwtToken");
const validateMongoDBId = require("../config/validateMongoDBId");
const { authMiddleWare } = require("../middlewares/authMiddleware");
const User = require("../models/userModel");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const sendMail = require( "./emailController" );

const jwt = require( "jsonwebtoken" );

/**
 * 	CREATE USER
 */

const registerUser = asyncHandler(async (req, res) => {
	/** Get the email from req.body and find if user email exist */
	const email = req.body.email;

	/** Find user with email */
	const findUser = await User.findOne({ email: email });
	if (!findUser) {
		/** Create user */
		const createUser = await User.create(req.body);
		res.status(200).json({
			status: true,
			message: "User Created Successfully!",
			createUser,
		});
	} else {
		// res.status(200).json({
		// 	status: true,
		// 	message: `User with ${email} already exist!`
		// });
		throw new Error("User already exist!");
	}
});

/**
 * 	USER LOGIN
 */

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	/** Check if user exist */
	const fetchedUser = await User.findOne({ email: email });
	// console.log( fetchedUser );
	


	// switch (fetchedUser.status) {
	// 	case 1: {
			if ( fetchedUser && ( await fetchedUser.isPasswordMatched( password ) ) ) {
				
				const token = generateToken( fetchedUser );
				
				res.cookie( "token", token, {
					httpOnly: true
				}).status(200).json({
					status: true,
					message: "Logged In Successfully!",
					role: fetchedUser?.roles,
					username: fetchedUser?.firstname + " " + fetchedUser?.lastname,
					userimage: fetchedUser?.user_image,
					// consoleMessage: console.log(fetchedUser?._id)
				});
			} else {
				throw new Error("Envalid Credentials!");
			}
	// 	}
	// 	case 2:
	// 		throw new Error("Account Inactive, contact admin!");
	// 	case 3:
	// 		throw new Error("Account Blocked, contact admin!");
	// 	case 4:
	// 		throw new Error("Account Pending Approval!");
	// 	case 5:
	// 		throw new Error("Account in Progress, contact admin!");
	// 	default:
	// 		throw new Error("Account Inactive, contact admin!");
	// }
});

/**
 * 	GET ALL USERS
 */
const getUsers = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongoDBId(_id);
	try {
		const allUsers = await User.find();
		const filteredUsers = await User.find({ status: process.env.ACTIVE });
		console.log("Filter users: ", filteredUsers);
		res.status(200).json({
			status: true,
			message: "All Users Fetched Successfully!",
			allUsers,
		});
	} catch (error) {
		throw new Error(error);
	}
});

/**
 * 	GET USER
 */
const getUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDBId(id);
	try {
		const getProfile = await User.findById({ _id: id });
		if (getProfile.status == 1) {
			res.status(200).json({
				status: true,
				message: "User found!,",
				getProfile,
			});
		} else {
			res.status(203).json({
				status: false,
				message: "user not found!",
			});
		}
	} catch (error) {
		throw new Error(error);
	}
});

/**
 * 	UPDATE USER
 */
const updateUserProfile = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongoDBId(_id);
	try {
		const user = await User.findByIdAndUpdate(_id, req.body, { new: true });

		res.status(200).json({
			status: true,
			message: "Profile Updated Successfully",
			user,
		});
	} catch (error) {
		throw new Error(error);
	}
});

/**
 * 	UPDATE USER PASSWORD
 */

const updateUserPassword = asyncHandler(async (req, res) => {
	// console.log("init password change")
	const { _id } = req.user;
	const { password } = req.body;
	validateMongoDBId(_id);

	try {
		const user = await User.findById(_id);
		if (await user.isPasswordMatched(password)) {
			throw new Error("Please provide a new password instead of old one!");
		} else {
			user.password = password;
			await user.save();
			res.status(200).json({
				status: true,
				message: "Password Updated Successfully!",
			});
		}
	} catch (error) {
		throw new Error(error);
	}

	// res.status(200).json({
	//    status: true, message: "Something must kill a man!",
	// });
});

/**
 * 	BLOCK USER
 */
const blockUser = asyncHandler(async (req, res) => {
	console.log("block init");
	const { id } = req.params;
	validateMongoDBId(id);
	try {
		const user = await User.findById(id);
		console.log(user);
		if (user.status == 1) {
			console.log("Status: active!");
			const blockedUser = await User.findByIdAndUpdate(
				id,
				{ isBlocked: true },
				{ new: true }
			);
			res.status(200).json({
				status: true,
				message: "User blocked successfully!,",
				blockedUser,
			});
		} else {
			res.status(203).json({
				status: false,
				message: "User not active!",
			});
		}
	} catch (error) {
		throw new Error(error);
	}
});

/**
 * 	UNBLOCK USER
 */
const unblockUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDBId(id);
	try {
		const user = await User.findById(id);
		if (user.status == 1) {
			const UnblockedUser = await User.findByIdAndUpdate(
				id,
				{ isBlocked: false },
				{ new: true }
			);
			res.status(200).json({
				status: true,
				message: "User unblocked successfully!,",
				UnblockedUser,
			});
		} else {
			res.status(203).json({
				status: false,
				message: "User not active!",
			});
		}
	} catch (error) {
		throw new Error(error);
	}
});

/**
 * 	DELETE USER
 */
const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDBId(id);
	try {
		const userExist = await User.findById(id);
		console.log(userExist);
		if (userExist !== null) {
			// await User.findByIdAndDelete(id); data should not be deleted from any system
			await User.findByIdAndUpdate(id, req.body, { new: true });
			res.status(200).json({
				status: true,
				message: "User Deleted Successfully!",
			});
		} else {
			res.status(203).json({
				status: false,
				message: "User Does Not Exist!",
			});
		}
	} catch (error) {
		throw new Error(error);
	}
});

/**
 * 	FORGOT PASSWORD TOKEN
 */
const forgetPasswordToken = asyncHandler(async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email: email });
	if (!user) throw new Error("User does not exist!");

	try {
		const token = await user.createPasswordResetToken();
		await user.save();
		const resetLink = `http://localhost:4000/api/user/reset-password/${token}`;
		console.log(email);
		const data = {
			to: email,
			subject: "Forgot Password Reset Link",
			text: `Hey ${user.firstname + " " + user.lastname}`,
			html: resetLink,
		};
		sendMail(data);
		res.status(200).json(resetLink);
	} catch (error) {
		throw new Error(error);
	}
});

/**
 * 	RESET PASSWORD
 */
const resetPassword = asyncHandler(async (req, res) => {
	const { password } = req.body;
	const { token } = req.params;
	const hashToken = crypto.createHash("sha256").update(token).digest("hex");
	const user = await User.findOne({
		passwordResetToken: hashToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	if (!user) throw new Error("Token Expired, Please try again!");
	user.password = password;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	res.status(200).json({
		status: true,
		message: "Password Reseted Successfully!",
	});
});

const test = asyncHandler(async (req, res) => {});

module.exports = {
	registerUser,
	loginUser,
	getUser,
	getUsers,
	updateUserProfile,
	updateUserPassword,
	blockUser,
	unblockUser,
	deleteUser,
	forgetPasswordToken,
	resetPassword,
	test,
};
