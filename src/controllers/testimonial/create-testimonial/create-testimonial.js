import { Testimonial } from "../../../models/testimonial/testimonial.model.js";
import { uploadToS3 } from "../../../s3/s3.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const createTestimonial = async (req, res) => {
  try {
    let testimonialData = JSON.parse(req.body.data);
    const { name, rating, review_text, review_date, city, product_code } =
      testimonialData ?? {};

    const files = req?.files;
    let uploadedProductImages = [];
    let uploadedProfilePic = "";

    if (files?.product_images?.length > 0) {
      uploadedProductImages = await Promise.all(
        files?.product_images?.map((file) =>
          uploadToS3({
            file,
            key: `${req.seller._id}/testimonials/${name}-images-${Date.now()}-${
              file.originalname
            }`,
          })
        )
      );
    }

    if (files?.profile_pic) {
      uploadedProfilePic = await uploadToS3({
        file: files?.profile_pic?.[0],
        key: `${
          req.seller._id
        }/testimonials/${name}-${name}-profile-pic-${Date.now()}-${
          files?.profile_pic?.[0]?.originalname
        }`,
      });
    }

    await Testimonial.create({
      short_id: generateShortId(10),
      name,
      rating,
      review_text,
      review_date,
      city,
      product_code,
      media: (uploadedProductImages || [])?.map((res) => res?.url),
      profile_picture: uploadedProfilePic?.url || "",
      seller: req?.seller?._id,
    });

    res.status(200).json({ message: "Testimonial Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { createTestimonial };
