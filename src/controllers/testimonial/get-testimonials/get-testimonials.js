import { Testimonial } from "../../../models/testimonial/testimonial.model.js";

const getTestimonials = async (req, res) => {
  try {
    const testimonial_data = await Testimonial.find({
      seller: req?.seller?._id,
    }).select("-createdAt -updatedAt -seller");
    res.status(200).json({ data: testimonial_data || [] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { getTestimonials };
