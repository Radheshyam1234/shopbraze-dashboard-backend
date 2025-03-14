import { Router } from "express";
import {
  createCatalogue,
  deleteCatalogue,
  getCatalogueById,
  getCatalogues,
  updateCatalogue,
  updateCatalogueSkuData,
} from "../../controllers/catalogue/index.js";
import { verifyAuth } from "../../middlewares/verify-auth.js";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyAuth);

router.use(
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 2 },
  ])
);

router.route("/").post(createCatalogue).get(getCatalogues);

router
  .route("/:catalogueId")
  .get(getCatalogueById)
  .put(updateCatalogue)
  .delete(deleteCatalogue);

router.route("/update-sku/:catalogueShortId").put(updateCatalogueSkuData);

export default router;
