import { Router } from "express";

import verifyJWT from "../../middlewares/verify-jwt.js";
import {
  createCollection,
  getCollections,
} from "../../controllers/collection/index.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createCollection).get(getCollections);

export default router;
