import { Testimonial } from "../../../models/testimonial/testimonial.model.js";
import { uploadToS3, deleteFromS3 } from "../../../s3/s3.js";

const updateTestimonial = async (req, res) => {
  try {
    const { testimonial_short_id } = req?.params;

    const existingTestimonial = await Testimonial.findOne({
      short_id: testimonial_short_id,
      seller: req?.seller?._id,
    });

    if (!existingTestimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    const data = JSON.parse(req.body?.data || "{}");
    const delete_media = JSON.parse(req.body?.delete_media || "{}");
    const all_product_images = JSON.parse(req.body?.all_product_images || "[]");
    const profile_pic_image = JSON.parse(req.body?.profile_pic_image || "{}");

    /* -------------------------- Handle Product Images ---------------------------------------------------- */
    let finalProductImages = [];
    if (
      all_product_images.length > 0 ||
      delete_media?.product_images?.length > 0
    ) {
      const filesToBeUploaded = req?.files?.product_images || [];
      let uploadIndex = 0;

      for (let i = 0; i < all_product_images?.length; i++) {
        const image = all_product_images[i];
        if (image?.url) {
          finalProductImages.push({ url: image.url });
        } else if (uploadIndex < filesToBeUploaded.length) {
          const uploadedImage = await uploadToS3({
            file: filesToBeUploaded[uploadIndex],
            key: `${req.seller._id}/testimonials/${
              existingTestimonial?.name
            }-image-${Date.now()}-${
              filesToBeUploaded[uploadIndex].originalname
            }`,
          });
          finalProductImages.push({ url: uploadedImage.url });
          uploadIndex++;
        }
      }
    }

    /* -------------------------- Handle Profile Picture ---------------------------------------------------- */
    let finalProfilePic = existingTestimonial?.profile_pic || null;
    const newProfilePicFile = req?.files?.profile_pic?.[0];

    if (profile_pic_image?.url) {
      finalProfilePic = { url: profile_pic_image.url };
    } else if (newProfilePicFile) {
      const uploadedPic = await uploadToS3({
        file: newProfilePicFile,
        key: `${req.seller._id}/testimonials/${
          existingTestimonial?.name
        }-profile-pic-${Date.now()}-${newProfilePicFile.originalname}`,
      });
      finalProfilePic = { url: uploadedPic.url };
    }

    /* -------------------------- Update Testimonial in DB ---------------------------------------------------- */
    await Testimonial.updateOne(
      { short_id: testimonial_short_id },
      {
        $set: {
          ...data,
          ...(all_product_images.length > 0 ||
          delete_media?.product_images?.length > 0
            ? { media: finalProductImages?.map((res) => res?.url) }
            : {}),
          ...(newProfilePicFile ||
          delete_media?.profile_pic?.length > 0 ||
          profile_pic_image?.url
            ? { profile_picture: finalProfilePic?.url }
            : {}),
        },
      },
      { runValidators: true }
    );

    res.status(200).json({ message: "Testimonial updated successfully" });

    /*-----------------Deleting Media----------------- */

    // Delete previous profile pic if requested
    if (delete_media?.profile_pic?.length > 0) {
      await Promise.all(
        delete_media.profile_pic.map((url) => deleteFromS3(url))
      );
    }

    // Delete images from S3
    if (delete_media?.product_images?.length > 0) {
      await Promise.all(
        delete_media.product_images.map((url) => deleteFromS3(url))
      );
    }
  } catch (error) {
    console.error("Update Testimonial Error:", error);
    res.status(500).json({ error: error?.message });
  }
};

const toggleTestimonialVisibility = async (req, res) => {
  try {
    const { testimonial_id } = req?.params;
    const { visibility } = req?.body;

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      testimonial_id,
      { $set: { is_visible: visibility } },
      { new: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.status(200).json({ message: "Saved Successfully" });
  } catch (error) {
    console.error("Update Testimonial Error:", error);
    res.status(500).json({ error: error?.message });
  }
};

export { updateTestimonial, toggleTestimonialVisibility };
