import { Router } from "express";

import verifyJWT from "../../middlewares/verify-jwt.js";
import {
  createCollection,
  deleteCollection,
  getCollections,
  toggleCollectionVisibility,
  updateCollectionDetails,
} from "../../controllers/collection/index.js";
import { getCollectionById } from "../../controllers/collection/get-collections/get-collections.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createCollection).get(getCollections);

router
  .route("/toggle-visibility/:collectionId")
  .put(toggleCollectionVisibility);

router
  .route("/:collectionId")
  .get(getCollectionById)
  .put(updateCollectionDetails)
  .delete(deleteCollection);

export default router;
