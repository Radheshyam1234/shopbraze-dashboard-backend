import mongoose, { Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const WebsitePageTemplateSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    short_id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "banner",
        "category_group",
        "product_group",
        "category_tabbed",
        "testimonial",
      ],
    },
    sub_type: {
      type: String,
      enum: [
        "new_arrivals",
        "best_sellers",
        "all_products",
        "curated",
        "recently_viewed",
      ],
    },
    is_visible: {
      type: Boolean,
      default: true,
    },
    layout: {
      type: String,
      enum: ["grid", "carousel"],
    },
    custom_style: {
      title_alignment: {
        type: String,
      },
      _id: false,
    },
    template_settings: {
      sort_by: { type: String },
      autoplay: { type: Boolean },
      mobileview_rowcount: { type: Number },
      desktopview_rowcount: { type: Number },
      filter_by: { type: String },
      _id: false,
    },

    banner_data: [
      {
        link: { type: String },
        img_url: { type: String },
        _id: false,
      },
    ],
    category_group_data: [
      {
        name: { type: String },
        img_url: { type: String },
        link: { type: String },
        _id: false,
      },
    ],
    category_tabbed_data: [
      {
        name: { type: String },
        collection_short_id: { type: String },
        _id: false,
      },
    ],
    product_group_data: {
      collection_short_id: { type: String },
      _id: false,
    },

    seller: { type: ObjectId, ref: "Seller", required: true },
  },
  {
    timestamps: true,
  }
);

export const WebsitePageTemplate = mongoose.model(
  "WebsitePageTemplate",
  WebsitePageTemplateSchema
);
