import express from "express";
import * as blogController from "../controller/blogController.js";

const router = express.Router();

// get all blogs
router.get("/", blogController.getAllBlogs);

// get blog by ID
router.get(":id", blogController.getBlogByID);

// create new blog post
router.post("/", blogController.createBlog);

// liking a blog post
router.put("/like/:id", blogController.likeBlog)

// create new comment
router.post("/comment/:id", blogController.createComment)

// like a comment
router.put("/comment/like/:commentIndex/:id", blogController.likeComment);

export default router;