import { Router } from "express";
import { getCatalogueReports } from "../../controllers/reports/reports.controller.js";
import { verifyAuth } from "../../middlewares/verify-auth.js";

const router = Router();

router.use(verifyAuth);

router.route("/catalogue").get(getCatalogueReports);

export default router;
