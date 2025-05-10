import mongoose from "mongoose";

export const AddressSchema = new mongoose.Schema(
  {
    building_name: {
      type: String,
      required: true,
    },
    area_name: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

export const CustomerSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
    },
    address: {
      type: AddressSchema,
    },
  },
  {
    timestamps: true,
  }
);

export const Customer = mongoose.model("Customer", CustomerSchema);
