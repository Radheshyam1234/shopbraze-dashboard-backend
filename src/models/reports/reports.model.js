import mongoose, { Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const BulkUploadReportSchema = new Schema(
  {
    file_name: {
      type: String,
      required: true,
    },
    uploaded_file_url: {
      type: String,
      required: true,
    },
    upload_type: {
      type: String,
      required: true,
      enum: ["New Catalogue"],
    },
    uploaded_time: {
      type: String,
      default: "",
    },
    uploaded_status: {
      type: String,
      required: true,
      enum: ["Completed", "Failed"],
    },
    uploaded_completed_time: {
      type: String,
      default: "",
    },
    total_row: {
      type: Number,
      required: true,
    },
    total_upload_count: {
      type: Number,
    },
    success_count: {
      type: Number,
    },
    failed_count: {
      type: Number,
    },
    report_url: {
      type: String,
      required: true,
    },
    user_type: {
      type: String,
      required: true,
      enum: ["Admin", "Seller"],
    },
    seller: { type: ObjectId, ref: "Seller" },
  },
  { timestamps: true }
);

export const BulkUploadReport = mongoose.model(
  "BulkUploadReport",
  BulkUploadReportSchema
);
