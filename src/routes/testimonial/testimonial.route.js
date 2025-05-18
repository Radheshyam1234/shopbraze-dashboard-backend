import { Router } from "express";

import { verifyAuth } from "../../middlewares/verify-auth.js";
import multer from "multer";
import {
  createTestimonial,
  getTestimonials,
  toggleTestimonialVisibility,
  updateTestimonial,
} from "../../controllers/testimonial/index.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyAuth);

router.use(
  upload.fields([
    { name: "product_images", maxCount: 5 },
    { name: "profile_pic", maxCount: 1 },
  ])
);
router.route("/").post(createTestimonial).get(getTestimonials);
router.route("/:testimonial_short_id").put(updateTestimonial);
router
  .route("/update-visibility/:testimonial_id")
  .put(toggleTestimonialVisibility);

export default router;
