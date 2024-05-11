const TutorialCategory = require("../models/tutorialCategoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const validateMongoDBId = require("../config/validateMongoDBId");

const createTutorialCategory = asyncHandler(async (req, res) => {
	// console.log(slugify);
	try {
		if (req.body.title) {
			req.body.slug = slugify(req.body.title.toLowerCase());
		}
		const createCategory = await TutorialCategory.create(req.body);
		res.status(200).json({
			status: true,
			message: "Tutorial Category Created Successfully!",
			createCategory,
		});
	} catch (error) {
		throw new Error(error);
	}
});

const getTutorialCategories = asyncHandler(async (req, res) => {
	try {
		const categories = await TutorialCategory.find();
		res.status(200).json({
			status: true,
			message: "Tutorial Categories Fetched Successfully!",
			categories,
		});
	} catch (error) {
		throw new Error(error);
	}
});

const getTutorialCategory = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDBId(id);
	try {
		const category = await TutorialCategory.findById(id);
		res.status(200).json({
			status: true,
			message: "Tutorial Category Fetched Successfully!",
			category,
		});
	} catch (error) {
		throw new Error(error);
	}
});

const updateTutorialCategory = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDBId(id);

	try {
		if (req.body.title) {
			req.body.slug = slugify(req.body.title.toLowerCase());
		}
		const category = await TutorialCategory.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res.status(200).json({
			status: true,
			message: "Tutorial Category Updated Successfully!",
			category,
		});
	} catch (error) {
		throw new Error(error);
	}
});

const deleteTutorialCategory = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDBId(id);
	try {
		const category = await TutorialCategory.findByIdAndDelete(id);
		res.status(200).json({
			status: true,
			message: "Tutorial Category Deleted Successfully!",
		});
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = {
	createTutorialCategory,
	getTutorialCategories,
	getTutorialCategory,
	updateTutorialCategory,
	deleteTutorialCategory,
};
