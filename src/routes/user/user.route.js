import { Router } from "express";
import { createSeller } from "../../controllers/user/seller.controller.js";
import { loginUser } from "../../controllers/user/index.js";

const router = Router();

// router.use(verifyJWT)

// router.route("/").post(createSeller);

router.route("/auth/login").post(loginUser);

export default router;
