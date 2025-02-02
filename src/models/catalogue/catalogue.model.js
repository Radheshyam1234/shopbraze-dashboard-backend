import mongoose, { Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

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
    seller: { type: ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// For compound Indexing
// CatalogueSchema.index(
//   {
//     product_code: 1,
//     "customer_skus.short_id": 1,
//     product_short_id: 1,
//     "customer_skus.sku_id": 1,
//   },
//   { unique: true, collation: { locale: "en", strength: 2 } }
// );

export const Catalogue = mongoose.model("Catalogue", CatalogueSchema);

// CatalogueSchema.pre('save', function(next) {
//   const skuIds = this.customer_skus.map(sku => sku.sku_id);
//   const hasDuplicate = skuIds.length !== new Set(skuIds).size;

//   if (hasDuplicate) {
//     const error = new Error('sku_id must be unique within the customer_skus array');
//     return next(error);
//   }

//   next();
// });
