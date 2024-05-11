const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler =require("express-async-handler");


/**
 * 	USER MIDDLEWARE HANDLER
 */

const authMiddleWare = asyncHandler(async (req, res, next) => {
	let token;
	
	// if (req?.headers?.authorization?.startsWith("Bearer")){
	// 	token = req?.headers.authorization?.split(" ")[1];

	

	if ( req?.cookies?.token ) {
		token = req.cookies.token;
		console.log( "Get request!" )
			// console.log("Token " + token)
		try {
			if (token) {
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				const user = await User.findById(decoded?.id);
				req.user = user;
				// req.user.roles = 'admin'
				
				console.log(decoded?.isAdmin)
				next();
			}
		} catch(error) {
			throw new Error("Not Authorized, Please Login Again!");
		}
	} else {
		throw new Error ("There is no token attached to the header...")
	}
});


/**
 * 	ADMIN MIDDLEWARE HANDLER
 */
const isAdmin = asyncHandler(async (req, res, next) => {
	
	if (req.user.roles !== "admin") {
		throw new Error ("You are not an Admin!");
	} else {
		next();
	}
} );

/**
 * 	INSTRUCTOR MIDDLEWARE HANDLER
 */

const isInstructor = asyncHandler(async (req, res, ) =>{
	if (req.user.roles !== "instructor") {
		throw new Error ("You are not an Instructor!");
	} else {
		next();
	}
});


/**
const authMiddleWare = asyncHandler(async (req, res, next) => {
	let token;
	if (req?.headers?.authorization?.startsWith("Bearer")){
		token = req?.headers.authorization?.split(" ")[1];
			// console.log("Token " + token)
		try {
			if (token) {
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				const user = await User.findById(decoded?.id);
				req.user = user;
				// console.log(user)
				next();
			}
		} catch(error) {
			throw new Error("Not Authorized, Please Login Again!");
		}
	} else {
		throw new Error ("There is no token attached to the header...")
	}
});



 * 	ADMIN MIDDLEWARE HANDLER

const isAdmin = asyncHandler(async (req, res, next) => {
	const { email } = req.user;
	const admin = await User.findOne({ email: email });
	if (admin.roles !== "admin") {
		throw new Error ("You are not an Admin!");
	} else {
		next();
	}
});

/**
 * 	INSTRUCTOR MIDDLEWARE HANDLER
* /
const isInstructor = asyncHandler(async (req, res, next) => {
	const { email } = req.user;
	const instructor = await User.findOne({ email: email });
	if (instructor.roles !== "instructor") {
		throw new Error ("You are not an Instructor!");
	} else {
		next();
	}
});
 */ 

module.exports = { authMiddleWare, isAdmin, isInstructor };

