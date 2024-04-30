import express from 'express';
import * as userController from "../controller/userController.js";

const router = express.Router();

// get all users
router.get("/", userController.getAllUsers);

// get user by ID
router.get("/:id", userController.getUserByID);

// creating a new user
router.post("/", userController.createUser);

// login
router.post("/login", userController.login);

export default router;