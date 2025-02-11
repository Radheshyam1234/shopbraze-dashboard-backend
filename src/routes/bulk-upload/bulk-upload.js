import { Router } from "express";
import verifyJWT from "../../middlewares/verify-jwt.js";
import {
  createCataloguesInBulk,
  createCollectionsInBulk,
} from "../../controllers/bulk-upload/index.js";

const router = Router();

router.use(verifyJWT);

router.route("/catalogues").post(createCataloguesInBulk);
router.route("/collections").post(createCollectionsInBulk);

export default router;
