const mongoose = require("mongoose");

let tutorialCategorySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		image: {
			type: String,
			default: "../assets/images/default-tutorial-image.png",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("TutorialCategory", tutorialCategorySchema);
