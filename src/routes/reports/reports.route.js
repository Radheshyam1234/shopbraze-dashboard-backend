import { Router } from "express";
import verifyJWT from "../../middlewares/verify-jwt.js";
import { getCatalogueReports } from "../../controllers/reports/reports.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/catalogue").get(getCatalogueReports);

export default router;
