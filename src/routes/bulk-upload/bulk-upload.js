import { Router } from "express";
import verifyJWT from "../../middlewares/verify-jwt.js";
import { createCataloguesInBulk } from "../../controllers/bulk-upload/index.js";

const router = Router();

router.use(verifyJWT);

router.route("/catalogues").post(createCataloguesInBulk);

export default router;
