import express from "express";
import * as roomController from "../controllers/room";
const router = express.Router();

router.get("/", roomController.getRooms);
router.get("/:roomId", roomController.getRoom);
router.post("/create", roomController.createRoom);
router.post("/join", roomController.joinRoom);
router.post("/leave", roomController.leaveRoom);
router.post("/banker", roomController.setBanker);

export default router;
