import mongoose, { Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const CouponSchema = new Schema(
  {
    coupon_type: {
      type: String,
      enum: ["generic", "other"],
      required: true,
    },
    short_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    min_order_value: {
      type: Number,
      required: true,
    },
    discount_type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    max_discount: {
      type: Number,
      required: true,
    },
    per_user_limit: {
      type: Number,
      required: true,
      default: 1,
    },
    max_usage: {
      type: Number,
      required: true,
      default: 1000,
    },
    // rules: {
    //   type: [String],
    //   required: true,
    // },
    only_for_new_customer: {
      type: Boolean,
      default: false,
    },
    globally_visible: {
      type: Boolean,
      default: false,
    },
    fake_expiry_flag: {
      type: Boolean,
      default: false,
    },
    fake_expiry_mins: {
      type: Number,
    },
    pre_apply_on_ad: {
      type: Boolean,
      default: false,
    },
    product_ids: {
      type: [String],
      default: [],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    expires_at: {
      type: String,
      required: true,
    },
    seller: {
      type: ObjectId,
      ref: "Seller",
      required: true,
    },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", CouponSchema);
