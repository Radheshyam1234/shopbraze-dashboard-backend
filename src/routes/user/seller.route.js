import { Router } from "express";
import { createSeller } from "../../controllers/user/seller.controller.js";

const router = Router();

// router.use(verifyJWT)

router.route("/").post(createSeller);

// router
//   .route("/:sellerId")
//   .get(getSellerDataById)
//   .post(updateSellerData)
//   .delete(deleteSellerData);

export default router;
