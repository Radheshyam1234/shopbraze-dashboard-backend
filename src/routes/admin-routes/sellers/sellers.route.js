import { Router } from "express";
import { verifyAuth } from "../../../middlewares/verify-auth.js";
import { restrictToSystemOnly } from "../../../middlewares/restrict-to-system-only.js";

import { getSellersList } from "../../../controllers/admin-controllers/sellers/index.js";
import { createSeller } from "../../../controllers/user/seller.controller.js";
import multer from "multer";

const router = Router();

router.use(verifyAuth);
router.use(restrictToSystemOnly);

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route("/").post(
  upload.fields([
    { name: "gst_file", maxCount: 1 },
    { name: "pan_file", maxCount: 1 },
    { name: "cheque_file", maxCount: 1 },
  ]),
  createSeller
);
router.route("/list").get(getSellersList);

export default router;
