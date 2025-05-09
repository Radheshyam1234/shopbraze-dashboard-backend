import mongoose, { Schema } from "mongoose";
const { ObjectId, Mixed } = mongoose.Schema.Types;

const SizeChartSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["static", "dynamic"],
      required: true,
    },
    static_type_image_url: {
      type: String,
    },
    unit_labels: [String],
    unit_labels_conversion_factor: {
      type: Mixed,
    },
    data_by_unit: {
      type: Map,
      of: [[String]],
      default: {},
    },
    product_short_ids: { type: [String] },
    seller: { type: ObjectId, ref: "Seller" },
  },
  { timestamps: true }
);

export const SizeChart = mongoose.model("SizeChart", SizeChartSchema);
