import { Router } from "express";
import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  getThemeConstants,
  getThemeSettings,
  getWebConfig,
  getWebsitePreset,
  resetThemeSettings,
  updateThemeSettings,
  updateWebConfig,
  updateWebsitePreset,
} from "../../controllers/website-page-configuration/index.js";
import multer from "multer";

const router = Router();

router.use(verifyAuth);

const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .route("/")
  .get(getWebConfig)
  .put(
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "favicon", maxCount: 1 },
    ]),
    updateWebConfig
  );
router.route("/theme-constants").get(getThemeConstants);
router.route("/theme-settings").get(getThemeSettings).put(updateThemeSettings);
router.route("/reset-theme-settings").post(resetThemeSettings);
router.route("/website-preset").get(getWebsitePreset).put(updateWebsitePreset);

export default router;
