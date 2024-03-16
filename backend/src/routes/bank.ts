import express from "express";
import * as bankController from "../controllers/bank";

const router = express.Router();

router.get("/", bankController.getBalance);
router.post("/transfer", bankController.transfer);
router.post("/deposit", bankController.deposit);
router.get("/parking", bankController.getFreeParking);
router.post("/claim", bankController.claimFreeParking);
router.post("/sendParking", bankController.sendFreeParking);

export default router;
