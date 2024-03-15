import express from "express";
import * as userController from "../controllers/user";

const router = express.Router();

//get authenticated user
router.get("/");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout");

export default router;