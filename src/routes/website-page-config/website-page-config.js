import { Router } from "express";

import verifyJWT from "../../middlewares/verify-jwt.js";
import {
  getThemeConstants,
  getThemeSettings,
  getWebsitePreset,
  updateThemeSettings,
  updateWebsitePreset,
} from "../../controllers/website-page-configuration/index.js";

const router = Router();

router.use(verifyJWT);

router.route("/theme-constants").get(getThemeConstants);
router.route("/theme-settings").get(getThemeSettings).put(updateThemeSettings);
router.route("/website-preset").get(getWebsitePreset).put(updateWebsitePreset);

export default router;
