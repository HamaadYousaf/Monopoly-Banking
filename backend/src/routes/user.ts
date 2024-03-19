import express from "express";
import * as userController from "../controllers/user";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticateJWT, userController.getAuthenticatedUser);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

export default router;
