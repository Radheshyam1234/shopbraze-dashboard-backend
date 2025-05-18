import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// import csrf from "csurf";
import {
  sessionExpirationRollingMiddleware,
  sessionMiddleware,
} from "./middlewares/express-session-middleware.js";
import { corsMiddleware } from "./middlewares/cors-middleware.js";

import multer, { memoryStorage } from "multer";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", true);

app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  next();
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(corsMiddleware);
// app.use(csrf({ cookie: true }));
app.use(sessionMiddleware);
app.use(sessionExpirationRollingMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to Shop Braze dashboard Backend");
});

//routes import
import pincodeRouter from "./routes/pin-code/pin-code.route.js";

import userRouter from "./routes/user/user.route.js";
import catalogueRouter from "./routes/catalogue/catalogue.route.js";
import sizeChartRouter from "./routes/size-chart/size-chart.route.js";
import collectionRouter from "./routes/collection/collection.route.js";
import bulkUploadRouter from "./routes/bulk-upload/bulk-upload.js";
import reportsRouter from "./routes/reports/reports.route.js";
import websitePageConfigRouter from "./routes/website-page-config/website-page-config.js";
import websitePagesRouter from "./routes/website-page/website-page.route.js";
import websitePageTemplateRouter from "./routes/website-page-template/website-page-template.route.js";
import websiteNavigationMenuRouter from "./routes/website-navigation-menu/website-navigation-menu.route.js";
import couponRouter from "./routes/coupon/coupon.route.js";
import ordersRouter from "./routes/orders/orders.route.js";
import ordersProcessingRouter from "./routes/orders-processing/orders-processing.route.js";
import testimonialRouter from "./routes/testimonial/testimonial.route.js";

import sellersRouter from "./routes/admin-routes/sellers/sellers.route.js";

//routes declaration
app.use("/api/pincode", pincodeRouter);

app.use("/api/user", userRouter);
app.use("/api/catalogues", catalogueRouter);
app.use("/api/size-charts", sizeChartRouter);
app.use("/api/collections", collectionRouter);
app.use("/api/bulk-upload", upload.single("file"), bulkUploadRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/website-page-config", websitePageConfigRouter);
app.use("/api/website-pages", websitePagesRouter);
app.use("/api/website-page-template", websitePageTemplateRouter);
app.use("/api/website-page-navigation-menu", websiteNavigationMenuRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/process-orders", ordersProcessingRouter);
app.use("/api/testimonials", testimonialRouter);

// For Admin Services

app.use("/api/user/sellers", sellersRouter);

export { app };
