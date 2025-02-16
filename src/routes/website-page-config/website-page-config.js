import { Router } from "express";
import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  getThemeConstants,
  getThemeSettings,
  getWebsitePreset,
  resetThemeSettings,
  updateThemeSettings,
  updateWebsitePreset,
} from "../../controllers/website-page-configuration/index.js";

const router = Router();

router.use(verifyAuth);

router.route("/theme-constants").get(getThemeConstants);
router.route("/theme-settings").get(getThemeSettings).put(updateThemeSettings);
router.route("/reset-theme-settings").post(resetThemeSettings);
router.route("/website-preset").get(getWebsitePreset).put(updateWebsitePreset);

export default router;
