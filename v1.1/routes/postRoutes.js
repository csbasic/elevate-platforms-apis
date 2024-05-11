const express = require("express");
const { post } = require("../controllers/postController");
const postRouter = express.Router();


postRouter.get( "/posts", post )


module.exports = postRouter