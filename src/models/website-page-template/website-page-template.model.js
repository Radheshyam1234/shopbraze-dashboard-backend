import mongoose, { Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const WebsitePageTemplateSchema = new Schema(
  {
    short_id: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
    sub_type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    layout: {
      type: String,
      required: true,
    },
    product_group: {
      type: {
        type: String,
      },
      products_data: {
        type: Array,
        default: [],
      },
    },
    tagged_entity: {
      type: {
        type: String,
      },
    },
    banner_cross_link: {
      type: Array,
      default: [],
    },
    custom_style: {
      title_alignment: {
        type: String,
      },
      background_color: {
        type: String,
      },
      is_background_image_repeat: {
        type: Boolean,
      },
    },
    gcs_background_image: {
      type: String,
    },
    is_visible: {
      type: Boolean,
    },
    is_active: {
      type: Boolean,
    },
    customisation_options: {
      type: Array,
      default: [],
    },
    template_settings: {
      sales_for_same_product: {
        type: Boolean,
        default: false,
      },
      aov_enabled: {
        type: Boolean,
        default: false,
      },
      is_mandatory: {
        type: Boolean,
        default: false,
      },
      sort_by: {
        type: String,
      },
      product_sort_type: {
        type: String,
      },
      filter_by: {
        type: String,
        default: "default",
      },
      mobile_view_row_count: {
        type: Number,
        default: 2,
      },
      desktop_view_row_count: {
        type: Number,
        default: 1,
      },
    },
    pending_media_upload: {
      type: Object,
      default: {},
    },
    seller: {
      type: ObjectId,
      ref: "Seller",
    },
  },
  {
    timestamps: true,
  }
);

export const WebsitePageTemplate = mongoose.model(
  "WebsitePageTemplate",
  WebsitePageTemplateSchema
);
