import { Router } from "express";
import { verifyAuth } from "../../middlewares/verify-auth.js";
import {
  createSizeChart,
  deleteSizeChart,
  getSizeCharts,
  updateSizeCharts,
} from "../../controllers/size-chart/index.js";
import multer from "multer";

const router = Router();

router.use(verifyAuth);

const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .route("/")
  .get(getSizeCharts)
  .post(upload.single("static_type_image"), createSizeChart);

router
  .route("/:size_chart_id")
  .put(upload.single("static_type_image"), updateSizeCharts);

router.route("/:size_chart_id").delete(deleteSizeChart);

export default router;
