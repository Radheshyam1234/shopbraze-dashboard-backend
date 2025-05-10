import mongoose, { Schema } from "mongoose";
const { ObjectId, Mixed } = mongoose.Schema.Types;

const CustomerSkuSchema = new Schema({
  size: {
    type: String,
    required: true,
  },
  short_id: {
    type: String,
    required: true,
    unique: true,
  },
  sku_id: {
    type: String,
    required: true,
    unique: true,
  },
  length: {
    type: Number,
    required: true,
  },
  breadth: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  cost_price: {
    type: Number,
    required: true,
  },
  selling_price: {
    type: Number,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true,
  },
  is_custom_sku_size: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const CatalogueSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    product_type: {
      type: String,
    },
    color: {
      type: String,
    },
    size_type: {
      type: String,
      required: true,
    },
    pickup_point: {
      type: String,
      required: true,
    },
    return_condition: {
      type: String,
      required: true,
    },
    product_code: {
      type: String,
      required: true,
      unique: true,
    },
    product_short_id: {
      type: String,
      required: true,
      unique: true,
    },
    gst_number: {
      type: String,
    },
    product_attributes: [
      {
        key: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    customer_skus: [CustomerSkuSchema],
    collections_to_add: [{ type: String }],
    media: {
      images: [{ url: { type: String }, index: { type: Number }, _id: false }],
      videos: [{ url: { type: String }, index: { type: Number }, _id: false }],
    },
    is_visible: {
      type: Boolean,
      required: true,
      default: true,
    },
    size_charts: [
      {
        size_chart_id: { type: ObjectId, ref: "SizeChart" },
        data_by_unit: Mixed,
        updated_at: { type: Date, default: Date.now },
      },
    ],
    active_size_chart_id: { type: ObjectId, ref: "SizeChart" },

    seller: { type: ObjectId, ref: "Seller" },
  },
  {
    timestamps: true,
  }
);

CatalogueSchema.index({
  collections_to_add: 1,
});

export const Catalogue = mongoose.model("Catalogue", CatalogueSchema);
