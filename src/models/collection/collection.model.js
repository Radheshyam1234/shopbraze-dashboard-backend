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
    },
    type: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
    },
    visible: {
      type: Boolean,
    },
    seller: { type: Object, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const Collection = mongoose.model("Collection", CollectionSchema);
