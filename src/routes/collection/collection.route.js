import { Router } from "express";
import {
  createCollection,
  getCollections,
} from "../../controllers/collection/collection.controller.js";
import verifyJWT from "../../middlewares/verify-jwt.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createCollection).get(getCollections);

export default router;
