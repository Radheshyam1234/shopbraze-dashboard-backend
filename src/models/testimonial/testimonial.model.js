import mongoose, { Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const TestimonialSchema = new Schema(
  {
    short_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
    review_text: {
      type: String,
    },
    product_code: {
      type: String,
    },
    media: {
      type: [String],
      default: [],
    },
    review_date: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
    },
    is_visible: {
      type: Boolean,
      default: true,
    },
    profile_picture: {
      type: String,
      default: "",
    },
    seller: { type: ObjectId, ref: "Seller", required: true },
  },
  {
    timestamps: true,
  }
);

export const Testimonial = mongoose.model("Testimonial", TestimonialSchema);
