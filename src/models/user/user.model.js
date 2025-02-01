// import mongoose, { Schema } from "mongoose";

// const AddressSchema = new Schema({
//   addr: { type: String, required: false },
//   city: { type: String, required: false },
//   company_name: { type: String, required: false },
//   contact_number: { type: String, required: false },
//   email: { type: String, required: false },
//   pincode: { type: String, required: false },
//   state: { type: String, required: false },
//   addr_tag_3pl: { type: String, required: false }, // Only for billing address
//   name: { type: String, required: false }, // Only for return address
//   nickname: { type: String, required: false }, // Only for pickup address
//   landmark: { type: String, required: false }, // Only for pickup address
// });

// const SettingsSchema = new Schema({
//   payment_mode: {
//     type: [String],
//     enum: ["online", "cod", "partial-cod"],
//     required: true,
//   },
// });

// const UserSchema = new Schema(
//   {
//     display_name: { type: String, required: true },
//     first_name: { type: String, required: true },
//     last_name: { type: String, required: false },
//     seller_type: { type: String, required: true }, // e.g., "ecomm"
//     preferred_web_prefix: { type: String, required: false },
//     contact_number: { type: String, required: true },
//     custom_domain: { type: String, required: false },
//     email: { type: String, required: true },
//     whatsapp_number: { type: String, required: false },
//     additional_login_number: { type: [String], required: false },
//     description: { type: String, required: false },
//     settings: { type: SettingsSchema, required: true },
//     profile_photo: { type: String, required: false },
//     is_paytm_enable: { type: Boolean, default: false },
//     is_razorpay_enable: { type: Boolean, default: false },
//     is_easebuzz_enable: { type: Boolean, default: false },
//     billing_address: { type: AddressSchema, required: true },
//     is_same_return_address: { type: Boolean, default: true },
//     return_address: { type: AddressSchema, required: false },
//     pickup_address: { type: [AddressSchema], required: true },
//     addr_tag_3pl: { type: String, required: false },
//     pan_card_no: { type: String, required: false },
//     gst_no: { type: String, required: false },
//     is_gst: { type: Boolean, default: false },
//     domain_duplication_approved: { type: Boolean, default: false },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const User = mongoose.model("User", UserSchema);
