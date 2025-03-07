import { Router } from "express";
import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  copyTemplate,
  createTemplate,
  deleteTemplate,
  getTemplatesInPage,
  reorderTemplatesInPage,
  toggleTemplateVisibility,
} from "../../controllers/website-page-template/index.js";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyAuth);

router.route("/").post(upload.array("images", 20), createTemplate);
router.route("/templates-in-page/:pageId").get(getTemplatesInPage);
router.route("/reorder-templates").post(reorderTemplatesInPage);
router.route("/toggle-visibility/:templateId").put(toggleTemplateVisibility);
router.route("/:templateId").delete(deleteTemplate);
router.route("/copy-template/:templateId/:pageId").post(copyTemplate);

export default router;
