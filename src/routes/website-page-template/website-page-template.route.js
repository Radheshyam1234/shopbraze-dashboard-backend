import { Router } from "express";
import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  createTemplate,
  getTemplatesInPage,
} from "../../controllers/website-page-template/index.js";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyAuth);

router.route("/").post(upload.array("images", 20), createTemplate);
router.route("/templates-in-page").get(getTemplatesInPage);

export default router;
