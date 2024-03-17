import express from "express";
import * as logController from "../controllers/log";

const router = express.Router();

router.get("/:roomId", logController.getLogs);

export default router;
