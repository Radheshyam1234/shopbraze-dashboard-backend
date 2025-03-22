import { Router } from "express";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
} from "../../controllers/coupon/index.js";
import { verifyAuth } from "../../middlewares/verify-auth.js";

const router = Router();

router.use(verifyAuth);

router.route("/").post(createCoupon).get(getAllCoupons);
router.route("/:couponId").put(updateCoupon);

export default router;
