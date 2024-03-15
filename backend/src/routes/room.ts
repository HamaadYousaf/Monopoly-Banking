import express from "express";
import * as roomController from "../controllers/room";
const router = express.Router();

router.get("/", roomController.getRooms);
router.get("/:roomId", roomController.getRoom);
router.post("/create", roomController.createRoom);
router.post("/join", roomController.joinRoom);

export default router;
