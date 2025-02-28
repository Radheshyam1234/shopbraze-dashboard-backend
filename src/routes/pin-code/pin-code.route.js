import { Router } from "express";
import { getLocationByPinCode } from "../../controllers/pin-code/index.js";

const router = Router();

router.route("/:pincode").get(getLocationByPinCode);

export default router;
