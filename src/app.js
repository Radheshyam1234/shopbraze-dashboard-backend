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
import userRouter from "./routes/user/user.route.js";
import catalogueRouter from "./routes/catalogue/catalogue.route.js";
import collectionRouter from "./routes/collection/collection.route.js";
import sellerRouter from "./routes/user/user.route.js";
import bulkUploadRouter from "./routes/bulk-upload/bulk-upload.js";
import reportsRouter from "./routes/reports/reports.route.js";
import websitePageConfigRouter from "./routes/website-page-config/website-page-config.js";

import sellersRouter from "./routes/admin-routes/sellers/sellers.route.js";

//routes declaration
app.use("/api/user", userRouter);
app.use(
  "/api/catalogues",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 1 },
  ]),
  catalogueRouter
);
app.use("/api/collections", collectionRouter);
app.use("/api/user/sellers", sellerRouter);
app.use("/api/bulk-upload", upload.single("file"), bulkUploadRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/website-page", websitePageConfigRouter);

app.use("/api/user/sellers", sellersRouter);

export { app };
