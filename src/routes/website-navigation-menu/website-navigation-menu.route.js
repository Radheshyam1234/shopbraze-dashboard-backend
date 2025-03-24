import { Router } from "express";
import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  createNavigationMenu,
  updateNavigationMenu,
  getNavigationMenuItems,
} from "../../controllers/website-navigation-menu/index.js";

const router = Router();

router.use(verifyAuth);

router
  .route("/")
  .get(getNavigationMenuItems)
  .post(createNavigationMenu)
  .put(updateNavigationMenu);

export default router;
