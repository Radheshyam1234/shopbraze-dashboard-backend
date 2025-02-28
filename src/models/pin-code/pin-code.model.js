import mongoose, { Schema } from "mongoose";

const PinCodeSchema = new Schema({
  pincode: {
    type: Number,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  circle_name: {
    type: String,
  },
  region_name: {
    type: String,
  },
  division_name: {
    type: String,
  },
  office_name: {
    type: String,
  },
  office_type: {
    type: String,
  },
  delivery: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
});

export const PinCode = mongoose.model("PinCode", PinCodeSchema);
