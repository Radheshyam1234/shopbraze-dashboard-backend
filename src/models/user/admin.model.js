import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: false,
    },
    contact_number: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "system",
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = mongoose.model("Admin", AdminSchema);
