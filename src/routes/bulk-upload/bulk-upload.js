import { Router } from "express";
import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  createCataloguesInBulk,
  createCollectionsInBulk,
} from "../../controllers/bulk-upload/index.js";

const router = Router();

router.use(verifyAuth);

router.route("/catalogues").post(createCataloguesInBulk);
router.route("/collections").post(createCollectionsInBulk);

export default router;
