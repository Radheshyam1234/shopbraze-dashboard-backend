import { Router } from "express";

import verifyJWT from "../../middlewares/verify-jwt.js";
import {
  createCollection,
  deleteCollection,
  getCollections,
} from "../../controllers/collection/index.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createCollection).get(getCollections);

router.route("/:collectionId").delete(deleteCollection);

export default router;
