const mongoose = require("mongoose");

/*
let tutorialSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		tutorialCategory: { type: String, require: true },
		tutorialCategorySlug: { type: String, required: true },
		topicName: { type: String, required: true },
		content: { type: String, required: true },
		keywords: { type: [], required: true },
		image: {
			type: String,
			default: "../assets/images/default-tutorial-image.png",
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
	},
	{
		timestamps: true,
	}
);*/

let tutorialSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},

		slug: {
			type: String,
			required: true,
			index: true,
		},

		topic: { type: String, required: true, index: true },

		topicSlug: { type: String, required: true },

		tutorialCategory: { type: String, require: true },

		tutorialCategorySlug: { type: String, required: true },

		content: { type: String, required: true },

		video: {
			type: String,
			required: true,
			default: "../assets/videos/expo-tips.mp4",
		},

		keywords: { type: [], required: true },
		thumbnail: {
			type: String,
			default: "../assets/images/default-tutorial-image.png",
		},

		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
			required: true,
		},
		status: {
			type: Number,
			default: 4,
		},
	},

	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Tutorial", tutorialSchema);
