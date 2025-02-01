import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { uploadToS3, deleteFromS3 } from "../../../s3/s3.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const createCatalogue = async (req, res) => {
  try {
    const files = req?.files;
    let uploadedImages = [];
    let uploadedVideos = [];

    let catalogueData = JSON.parse(req.body.catalogue_data);
    const updatedSkuData = catalogueData?.customer_skus.map((item) => ({
      ...item,
      short_id: generateShortId(8),
    }));
    const product_short_id = generateShortId(8);
    catalogueData = {
      ...catalogueData,
      product_short_id,
      customer_skus: updatedSkuData,
      seller: req.seller._id,
    };

    const catalogue = await Catalogue.create({
      ...catalogueData,
      media: { images: [], videos: [] },
    });

    if (files?.images?.length > 0) {
      uploadedImages = await Promise.all(
        files.images.map((file) =>
          uploadToS3({
            file,
            key: `${req.seller._id}/${
              catalogueData?.title
            }-images-${Date.now()}-${file.originalname}`,
          })
        )
      );
    }

    if (files?.videos?.length > 0) {
      uploadedVideos = await Promise.all(
        files.videos.map((file) =>
          uploadToS3({
            file,
            key: `${req.seller._id}/${
              catalogueData?.title
            }-videos-${Date.now()}-${file.originalname}`,
          })
        )
      );
    }

    catalogue.media.images = uploadedImages;
    catalogue.media.videos = uploadedVideos;
    await catalogue.save();

    if (catalogue)
      res.status(201).json({
        message: "Catalogue created successfully!",
        data: catalogue,
      });
  } catch (error) {
    if (error.code === 11000) {
      const fieldName = Object.keys(error?.keyValue)?.[0];
      const duplicateValue = error?.keyValue?.[fieldName];
      return res.status(400).json({
        error: `Please enter a different value for ${fieldName}. The value "${duplicateValue}" is already taken.`,
      });
    }
    console.error("Error processing catalogue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createCatalogue };
