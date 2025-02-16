import { Router } from "express";

import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  createCollection,
  deleteCollection,
  getCollections,
  toggleCollectionVisibility,
  updateCollectionDetails,
} from "../../controllers/collection/index.js";
import { getCollectionById } from "../../controllers/collection/get-collections/get-collections.js";

const router = Router();

router.use(verifyAuth);

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
