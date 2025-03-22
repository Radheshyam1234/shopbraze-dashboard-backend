import dotenv from "dotenv";
import { app } from "./app.js";
import { connectRedis } from "./configurations/redis/index.js";
import { connectDB } from "./configurations/db/index.js";

import "./queues-and-worker/workers/index.js";

dotenv.config();

connectRedis()
  .then(() => {
    connectDB()
      .then(() => {
        app.listen(process.env.PORT || 8080, () => {
          console.log(
            `⚙️ Server is running at port : ${process.env.PORT || 8080}`
          );
        });
      })
      .catch((err) => {
        console.log("❌ MONGO DB connection failed !!! ", err);
      });
  })
  .catch((err) => {
    console.error("❌ Redis connection failed, exiting...", err);
    process.exit(1);
  });
