import mongoose from "mongoose";
import { Catalogue } from "../../models/catalogue/catalogue.model.js";

import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
    await Promise.all([Catalogue.syncIndexes()]);
    console.log("Indexes synced successfully! ✅");
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB Disconnected Successfully!");
  } catch (error) {
    console.error("❌ Error disconnecting MongoDB:", error.message);
  }
};

export { connectDB, disconnectDB };
