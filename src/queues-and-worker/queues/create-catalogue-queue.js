import { Queue } from "bullmq";
import { redisConfig } from "../../configurations/redis/index.js";

const createCatalogueImageUploadQueue = new Queue(
  "create-catalogue-image-queue",
  {
    connection: redisConfig,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: 2,
    },
  }
);

export { createCatalogueImageUploadQueue };
