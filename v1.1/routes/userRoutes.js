const express = require("express");
const {
	registerUser,
	getUsers,
	loginUser,
	deleteUser,
	getUser,
	blockUser,
	unblockUser,
	updateUserPassword,
	test,
	updateUserProfile,
	forgetPasswordToken,
	resetPassword,
} = require("../controllers/userController");
const { isAdmin, authMiddleWare } = require("../middlewares/authMiddleware");
const userRouter = express.Router();

/**
 *  ALL POST ROUTES
 */
userRouter.post("/user/register", registerUser);
userRouter.post("/user/login", loginUser);
userRouter.post("/user/forgot-password", forgetPasswordToken);

/**
 *  ALL GET ROUTES
 */
userRouter.get("/users/get-all", authMiddleWare, isAdmin, getUsers);

userRouter.get("/user/:id", authMiddleWare, getUser);

/**
 *  ALL PUT ROUTES
 */
userRouter.put("/user/update-profile", authMiddleWare, updateUserProfile);
userRouter.put("/user/block-user/:id", authMiddleWare, isAdmin, blockUser);
userRouter.put("/user/unblock-user/:id", authMiddleWare, isAdmin, unblockUser);
userRouter.put("/user/test", authMiddleWare, test);
userRouter.put("/user/update-password", authMiddleWare, updateUserPassword);
userRouter.put("/user/:id", authMiddleWare, isAdmin, deleteUser);
userRouter.put("/user/reset-password/:token", resetPassword);

// console.log(userRouter);

module.exports = userRouter;
