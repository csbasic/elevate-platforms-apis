const Tutorial = require("../models/tutorialModel");

const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDBId = require("../config/validateMongoDBId");

const createTutorial = asyncHandler(async (req, res) => {
	try {
		if (req.body.title) {
			req.body.slug = slugify(req.body.title.toLowerCase());
		}

		if (req.body.tutorialCategory) {
			req.body.tutorialCategorySlug = slugify(
				req.body.tutorialCategory.toLowerCase()
			);
		}

		if (req.body.topic) {
			req.body.topicSlug = slugify(req.body.topic.toLowerCase());
			req.body.thumbnail = req.body.topicSlug + ".mp4";
		}

		req.body.author = req.user._id.toString();
		console.log(req);
		const tutorial = await Tutorial.create(req.body);
		if (tutorial) {
		}
		res.status(200).json({
			status: true,
			message: "Tutorial Created Successfully!",
			tutorial,
		});
	} catch (error) {
		throw new Error(error);
	}
});

const getTutorials = asyncHandler(async (req, res) => {
	try {
		const fetchedTutorials = await Tutorial.find();
		if (fetchedTutorials) {
			res.status(200).json({
				status: true,
				message: "Tutorials Fetched Successfully",
				fetchedTutorials,
			});
		} else {
			res.status(200).json({
				status: true,
				message: "No Tutorial Created yet!",
			});
		}
	} catch (error) {
		throw new Error(error);
	}
});

const getAuthorTutorials = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const authorTutorials = await Tutorial.find({ author: id });
		res.status(200).json({
			status: true,
			message: "Tutorial Fetched Successfully",
			authorTutorials,
		});
	} catch (error) {
		throw new Error(error);
	}
});

const getTutorial = asyncHandler(async (req, res) => {
	const { type, slug } = req.params;
	console.log(slug, type);
	try {
		const fetchedTutorial = await Tutorial.findOne({
			tutorialCategorySlug: type,
			slug: slug,
		});
		// console.log(fetchedTutorial);
		const fetchedTutorialTopic = await Tutorial.find({
			tutorialCategorySlug: type,
		})
			.select("topicName title slug tutorialCategorySlug")
			.sort("createdAt");
		if (fetchedTutorial) {
			res.status(200).json({
				status: true,
				message: "Tutorial Fetched Successfully",
				fetchedTutorial,
				fetchedTutorialTopic,
			});
		} else {
			res.status(404).json({
				status: false,
				message: "No Tutorial Created yet!",
			});
		}
	} catch (error) {
		throw new Error(error);
	}
});

const UpdateTutorial = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDBId(id);
	try {
		if (req.body.title) {
			req.body.slug = slugify(req.body.title.toLowerCase());
		}
		if (req.body.tutorialCategory) {
			req.body.tutorialCategorySlug = slugify(
				req.body.tutorialCategory.toLowerCase()
			);
		}
		const updatedTutorial = await Tutorial.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (updatedTutorial) {
			res.status(200).json({
				status: true,
				message: "Tutorial Updated Successfully",
				updatedTutorial,
			});
		} else {
			res.status(404).json({
				status: true,
				message: "Tutorial not Found!",
			});
		}
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = {
	createTutorial,
	getTutorials,
	getTutorial,
	UpdateTutorial,
	getAuthorTutorials,
};
