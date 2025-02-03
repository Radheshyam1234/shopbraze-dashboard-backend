import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT || 8080, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT || 8080}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
app.use((req, res, next) => {
  req.setTimeout(300000);
  next();
});
