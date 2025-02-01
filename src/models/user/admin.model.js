import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact_number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = mongoose.model("Admin", AdminSchema);
