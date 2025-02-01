import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const BUCKET_NAME = process.env.AWS_BUCKET;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async ({ file, key }) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);

  try {
    const uploadedResponse = await s3.send(command);
    return {
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
  } catch (error) {
    console.log(error);
    throw new Error({ error });
  }
};

export const deleteFromS3 = async (imageUrl) => {
  try {
    if (!imageUrl) {
      throw new Error("Invalid image URL");
    }
    const key = imageUrl.split(
      `${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`
    )[1];

    if (!key) {
      throw new Error("No valid key extracted from the image URL");
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    await s3.send(new DeleteObjectCommand(params));

    return {
      success: true,
      message: "Image deleted successfully",
      deletedKey: key,
    };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, message: "Error deleting image", error };
  }
};
