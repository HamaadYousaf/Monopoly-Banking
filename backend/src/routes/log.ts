import express from "express";
import * as logController from "../controllers/log";

const router = express.Router();

router.get("/:roomId", logController.getLogs);
router.post("/add/:roomId", logController.addLog);
router.delete("/delete/:roomId", logController.deleteLogs);

export default router;
