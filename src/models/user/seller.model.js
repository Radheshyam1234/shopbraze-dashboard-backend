import mongoose, { Schema } from "mongoose";

const SellerSchema = new Schema(
  {
    display_name: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: false,
    },
    contact_number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Seller = mongoose.model("Seller", SellerSchema);
