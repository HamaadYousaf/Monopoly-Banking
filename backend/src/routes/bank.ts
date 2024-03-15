import express from "express";
import * as bankController from "../controllers/bank";

const router = express.Router();

router.get("/:userId", bankController.getBalance);
router.post("/transfer", bankController.transfer);
router.post("/deposit", bankController.deposit);
router.post("/claim", bankController.claimFreeParking);

export default router;
