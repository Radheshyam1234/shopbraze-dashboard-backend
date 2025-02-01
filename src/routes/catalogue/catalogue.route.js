import { Router } from "express";
import {
  createCatalogue,
  deleteCatalogue,
  getCatalogueById,
  getCatalogues,
  updateCatalogue,
  updateCatalogueSkuData,
} from "../../controllers/catalogue/index.js";
import verifyJWT from "../../middlewares/verify-jwt.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createCatalogue).get(getCatalogues);

router
  .route("/:catalogueId")
  .get(getCatalogueById)
  .put(updateCatalogue)
  .delete(deleteCatalogue);

router.route("/update-sku/:catalogueShortId").put(updateCatalogueSkuData);

export default router;
