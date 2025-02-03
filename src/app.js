import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import multer, { memoryStorage } from "multer";

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://yourfrontenddomain.com"],
//     credentials: true,
//   })
// );

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to Shop Braze dashboard Backend");
});

//routes import
import catalogueRouter from "./routes/catalogue/catalogue.route.js";
import collectionRouter from "./routes/collection/collection.route.js";
import sellerRouter from "./routes/user/seller.route.js";
import bulkUploadRouter from "./routes/bulk-upload/bulk-upload.js";
import reportsRouter from "./routes/reports/reports.route.js";

// Forcefully trying to ensure Indexing creation
// Catalogue.ensureIndexes().then(() => {
//   console.log("Indexes created");
// });

//routes declaration
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

export { app };
