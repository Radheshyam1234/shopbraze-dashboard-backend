import { Router } from "express";

import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  confirmOrder,
  generateAWB,
  getCourierServiceability,
} from "../../controllers/orders-processing/index.js";

const router = Router();

router.use(verifyAuth);

router.route("/confirm-order").post(confirmOrder);
router.route("/courier-serviceability").get(getCourierServiceability);
router.route("/generate-awb").post(generateAWB);

export default router;
