import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { uploadToS3, deleteFromS3 } from "../../../s3/s3.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const updateCatalogue = async (req, res) => {
  try {
    const { catalogueId } = req.params;
    const catalogue = await Catalogue.findOne({ _id: catalogueId });
    if (!catalogue) {
      return res.status(404).json({ error: "Catalogue not found" });
    }

    const catalogue_data = JSON.parse(req.body?.catalogue_data || "[]");
    const delete_media = JSON.parse(req.body?.delete_media || "[]");
    const all_images = JSON.parse(req.body.all_images || "[]"); // This will come only when any new image-file is getting added or deleted (deleted media will not be included in all_images)
    const all_videos = JSON.parse(req.body.all_videos || "[]"); // This will come only when any new video-file is getting added or deleted (deleted media will not be included in all_videos)

    /* -------------------------- For Images Handling --------------------------------------------------------------*/
    let finalImages = [];
    // means if any new files is added or file deleted otherwise keep same media data
    if (all_images?.length > 0 || delete_media?.images?.length > 0) {
      const filesToBeUpload = req?.files?.images || [];
      let toBeUploadFileIndex = 0;

      for (let i = 0; i < all_images?.length; i++) {
        const image = all_images?.[i];
        if (image?.url) {
          finalImages.push({ url: image.url });
        } else if (toBeUploadFileIndex < filesToBeUpload.length) {
          const uploadedImageData = await uploadToS3({
            file: filesToBeUpload[toBeUploadFileIndex],
            key: `${req.seller._id}/${
              catalogue_data?.title
            }-image-${Date.now()}-${
              filesToBeUpload[toBeUploadFileIndex]?.originalname
            }`,
          });
          finalImages.push({ url: uploadedImageData?.url });
          toBeUploadFileIndex++;
        }
      }
      if (delete_media?.images?.length > 0) {
        await Promise.all(delete_media?.images.map((url) => deleteFromS3(url)));
      }
    }

    /* -------------------------- For Videos Handling --------------------------------------------------------------*/
    let finalVideos = [];
    // means if any new files is added or file deleted otherwise keep same media data
    if (all_videos?.length > 0 || delete_media?.videos?.length > 0) {
      const filesToBeUpload = req?.files?.videos || [];
      let toBeUploadFileIndex = 0;

      for (let i = 0; i < all_videos?.length; i++) {
        const video = all_videos?.[i];
        if (video?.url) {
          finalVideos.push({ url: video.url });
        } else if (toBeUploadFileIndex < filesToBeUpload.length) {
          const uploadedVideoData = await uploadToS3({
            file: filesToBeUpload[toBeUploadFileIndex],
            key: `${req.seller._id}/${
              catalogue_data?.title
            }-video-${Date.now()}-${
              filesToBeUpload[toBeUploadFileIndex]?.originalname
            }`,
          });
          finalVideos.push({ url: uploadedVideoData?.url });
          toBeUploadFileIndex++;
        }
      }
      if (delete_media?.videos?.length > 0) {
        await Promise.all(
          delete_media?.videos?.map((url) => deleteFromS3(url))
        );
      }
    }

    /************************** For New SKus Added ( Then add shortId field to them) *************************************************** */

    const customer_skus = catalogue_data?.customer_skus?.map((skuData) => {
      if (!skuData?.short_id)
        // when new sku added
        return { ...skuData, short_id: generateShortId(8) };
      return skuData;
    });

    await Catalogue.updateOne(
      { _id: catalogueId },
      {
        $set: {
          ...catalogue_data,
          customer_skus,
          ...((all_images?.length > 0 || delete_media?.images?.length > 0) && {
            "media.images": finalImages,
          }),
          ...((all_videos?.length > 0 || delete_media?.videos?.length > 0) && {
            "media.videos": finalVideos,
          }),
        },
      },
      { new: true, runValidators: true }
    ).exec();

    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    if (error.code === 11000) {
      const fieldName = Object.keys(error?.keyValue)?.[0];
      const duplicateValue = error?.keyValue?.[fieldName];
      return res.status(400).json({
        error: `Please enter a different value for ${fieldName}. The value "${duplicateValue}" is already taken.`,
      });
    }
    console.log(error);
    res.status(500).json({ error });
  }
};

export { updateCatalogue };
