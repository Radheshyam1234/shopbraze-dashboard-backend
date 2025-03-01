import { Router } from "express";
import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  createWebsitePage,
  getHomePageInfo,
} from "../../controllers/website-page/index.js";

const router = Router();

router.use(verifyAuth);

router.route("/").post(createWebsitePage);
router.route("/home-page").get(getHomePageInfo);

export default router;
