import { Router } from "express";

import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  cancelOrder,
  cancelShipment,
  confirmOrder,
  generateAWB,
  generateInvoice,
  generateLabel,
  getCourierServiceability,
  getFuturePickupDates,
} from "../../controllers/orders-processing/index.js";

const router = Router();

router.use(verifyAuth);

router.route("/confirm-order").post(confirmOrder);
router.route("/courier-serviceability").get(getCourierServiceability);
router.route("/generate-awb").post(generateAWB);
router.route("/pickup-dates").get(getFuturePickupDates);
router.route("/generate-label").post(generateLabel);
router.route("/generate-invoice").post(generateInvoice);
router.route("/cancel-shipment").post(cancelShipment);
router.route("/cancel-order").post(cancelOrder);

export default router;
