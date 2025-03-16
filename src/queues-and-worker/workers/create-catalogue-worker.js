import { Worker } from "bullmq";
import { redisConfig } from "../../configurations/redis/index.js";
import { Catalogue } from "../../models/catalogue/catalogue.model.js";
import { uploadToS3, uploadUrlToS3 } from "../../s3/s3.js";
import { nanoid } from "nanoid";

const uploadImagesToS3AndUpdateDB = async (products, req) => {
  try {
    await Promise.all(
      products.map(async (product) => {
        const uploadPromises = product?.media?.images?.map(async (image) => {
          try {
            const key = `${req?.seller?._id}/product-images/${product?.title}-${
              product.product_short_id
            }-${nanoid(10)}`;
            const uploadResult = await uploadUrlToS3({
              fileUrl: image.url,
              key,
            });
            return { url: uploadResult.url, index: image.index }; // Successfully uploaded image
          } catch (error) {
            console.error(`❌ Failed to upload image: ${image.url}`, error);
            return { url: image.url, index: image.index }; // Retaining original image URL on failure
          }
        });

        const updatedImages = await Promise.all(uploadPromises);

        return {
          filter: { _id: product._id },
          update: { $set: { "media.images": updatedImages } },
        };
      })
    ).then(async (updates) => {
      await Catalogue.bulkWrite(
        updates.map(({ filter, update }) => ({
          updateOne: { filter, update },
        }))
      );
      console.log("✅ All images processed & DB updated!");
    });
  } catch (error) {
    console.error("❌ Error in batch image upload:", error);
  }
};

const createCatalogueImageWorker = new Worker(
  "create-catalogue-image-queue",
  async (job) => {
    console.log(
      `🚀 Processing job ${job?.id} for seller: ${job?.data?.sellerId}`
    );

    try {
      await uploadImagesToS3AndUpdateDB(job.data.products, {
        seller: { _id: job.data.sellerId },
      });

      console.log(`✅ Job ${job.id} completed successfully!`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Job ${job.id} failed:`, error);
      throw new Error("Image upload failed");
    }
  },
  {
    connection: redisConfig,
    concurrency: 5, // Controls the number of parallel uploads to avoid memory overload
  }
);

export { createCatalogueImageWorker };
