const {
	createTutorial,
	getTutorial,
	UpdateTutorial,
	getTutorials,
	getAuthorTutorials,
} = require("../controllers/tutorialController");
const { authMiddleWare, isAdmin } = require("../middlewares/authMiddleware");

const tutorialRouter = require("express").Router();

/**
 *    CREATE TUTORIAL
 */
tutorialRouter.post(
	"/tutorial/create",
	authMiddleWare,
	isAdmin,
	createTutorial
);

/**
 *    UPDATE TUTORIAL
 */
tutorialRouter.put(
	"/tutorial/update/:id",
	authMiddleWare,
	isAdmin,
	UpdateTutorial
);

tutorialRouter.get("/tutorials/author/:id", getAuthorTutorials);

/**
 *    GET TUTORIALS
 */
tutorialRouter.get("/tutorials", getTutorials);

/**
 *    GET TUTORIAL
 */
tutorialRouter.get("/tutorial/:type/:slug", getTutorial);
module.exports = tutorialRouter;
