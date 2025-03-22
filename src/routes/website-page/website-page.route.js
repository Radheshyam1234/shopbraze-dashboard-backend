import { Router } from "express";
import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  createWebsitePage,
  getHomePageInfo,
  getProductPageInfo,
} from "../../controllers/website-page/index.js";

const router = Router();

router.use(verifyAuth);

router.route("/").post(createWebsitePage);
router.route("/home-page").get(getHomePageInfo);
router.route("/product-page").get(getProductPageInfo);

export default router;
