const tutorialCategoryRouter = require("express").Router();

const {
	createTutorialCategory,
	getTutorialCategories,
	getTutorialCategory,
	updateTutorialCategory,
	deleteTutorialCategory,
} = require("../controllers/tutorialCategoryController");
const { authMiddleWare, isAdmin } = require("../middlewares/authMiddleware");

tutorialCategoryRouter.post(
	"/tutorial/category/create",
	authMiddleWare,
	isAdmin,
	createTutorialCategory
);
tutorialCategoryRouter.get("/tutorial/categories", getTutorialCategories);
tutorialCategoryRouter.get(
	"/tutorial/category/:id",
	authMiddleWare,
	isAdmin,
	getTutorialCategory
);
tutorialCategoryRouter.put(
	"/tutorial/category/:id",
	authMiddleWare,
	isAdmin,
	updateTutorialCategory
);
tutorialCategoryRouter.delete(
	"/tutorial/category/:id",
	authMiddleWare,
	isAdmin,
	deleteTutorialCategory
);

module.exports = tutorialCategoryRouter;
