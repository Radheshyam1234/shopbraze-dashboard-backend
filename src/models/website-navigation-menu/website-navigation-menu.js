import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const WebsiteNavigationMenuSchema = new mongoose.Schema(
  {
    short_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    parent_short_id: {
      type: String,
      default: null,
    },
    is_visible: {
      type: Boolean,
      default: true,
    },
    children: [
      {
        type: ObjectId,
        ref: "WebsiteNavigationMenu",
      },
    ],
    seller: {
      type: ObjectId,
      ref: "Seller",
      required: true,
    },
  },
  { timestamps: true }
);

export const WebsiteNavigationMenu = mongoose.model(
  "WebsiteNavigationMenu",
  WebsiteNavigationMenuSchema
);
