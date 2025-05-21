import { Router } from "express";
import {
  getPendingOrders,
  getReadyToShipOrders,
} from "../../controllers/orders/index.js";
import { verifyAuth } from "../../middlewares/verify-auth.js";

const router = Router();

router.use(verifyAuth);

router.route("/pending").get(getPendingOrders);
router.route("/ready-to-ship").get(getReadyToShipOrders);

export default router;
