import { Router } from "express";

import { verifyAuth } from "../../middlewares/verify-auth.js";
import { getCourierServiceability } from "../../controllers/orders-processing/index.js";

const router = Router();

router.use(verifyAuth);

router.route("/courier-serviceability").get(getCourierServiceability);

export default router;
