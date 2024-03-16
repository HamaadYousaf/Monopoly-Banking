import express from "express";
import * as logController from "../controllers/log";

const router = express.Router();

router.get("/", logController.getLogs);
router.post("/add", logController.addLog);
router.delete("/delete", logController.deleteLogs);

export default router;
