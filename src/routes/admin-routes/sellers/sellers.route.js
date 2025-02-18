import { Router } from "express";
import { verifyAuth } from "../../../middlewares/verify-auth.js";
import { restrictToSystemOnly } from "../../../middlewares/restrict-to-system-only.js";

import { getSellersList } from "../../../controllers/admin-controllers/sellers/index.js";

const router = Router();

router.use(verifyAuth);
router.use(restrictToSystemOnly);

router.route("/list").get(getSellersList);

export default router;
