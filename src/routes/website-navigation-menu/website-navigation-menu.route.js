import { Router } from "express";
import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  createNavigationMenuItem,
  updateNavigationMenuItems,
  getNavigationMenuItems,
  changeNavigationMenuItemVisibility,
  deleteNavigationMenuItem,
  updateNavigationMenuItemById,
} from "../../controllers/website-navigation-menu/index.js";

const router = Router();

router.use(verifyAuth);

router
  .route("/")
  .get(getNavigationMenuItems)
  .post(createNavigationMenuItem)
  .put(updateNavigationMenuItems);

router
  .route("/change-visibility/:navigationMenuId")
  .put(changeNavigationMenuItemVisibility);

router
  .route("/:navigationMenuId")
  .put(updateNavigationMenuItemById)
  .delete(deleteNavigationMenuItem);

export default router;
