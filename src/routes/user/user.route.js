import { Router } from "express";
import { getUserData, loginUser } from "../../controllers/user/index.js";
import { verifyAuth } from "../../middlewares/verify-auth.js";

const router = Router();

router.route("/auth/login").post(loginUser);
router.route("/auth/user").get(verifyAuth, getUserData);

export default router;
