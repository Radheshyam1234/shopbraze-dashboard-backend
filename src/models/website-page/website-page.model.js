import mongoose, { Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const WebsitePageSchema = new Schema(
  {
    short_id: {
      type: String,
    },
    type: {
      type: String,
      enum: ["home_page", "product_page", "order_status_page", "featured_page"],
    },
    internal_display_name: {
      type: String,
    },
    template_short_ids: [{ type: String }],
    is_visible: {
      type: Boolean,
    },
    is_active: {
      type: Boolean,
    },

    social_links: [{ type: String }],

    is_paginated: {
      type: Boolean,
    },
    seller: { type: ObjectId, ref: "Seller" },
  },
  {
    timestamps: true,
  }
);

export const WebsitePage = mongoose.model("WebsitePage", WebsitePageSchema);
