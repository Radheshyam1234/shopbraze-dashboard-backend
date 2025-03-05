import mongoose, { Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const CollectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    short_id: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["bulk_upload", "catalogues_selection"],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_visible: {
      type: Boolean,
      default: true,
    },
    seller: { type: ObjectId, ref: "Seller" },
  },
  {
    timestamps: true,
  }
);

export const Collection = mongoose.model("Collection", CollectionSchema);
