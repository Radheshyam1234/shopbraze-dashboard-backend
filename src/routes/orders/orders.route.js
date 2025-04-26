import { Router } from "express";
import { getPendingOrders } from "../../controllers/orders/index.js";
import { verifyAuth } from "../../middlewares/verify-auth.js";

const router = Router();

router.use(verifyAuth);

router.route("/pending").get(getPendingOrders);

export default router;
