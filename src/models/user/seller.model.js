import mongoose, { Schema } from "mongoose";

const BillingAddressSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
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
  pincode: {
    type: String,
    required: true,
  },
  addr_tag_3pl: {
    type: String,
    required: true,
  },
});

const PickupAddressSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  contact_number: {
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
  pincode: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
});

const ReturnAddressSchema = new mongoose.Schema({
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
  },
  address: {
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
  pincode: {
    type: String,
    required: true,
  },
});

const SellerSchema = new Schema(
  {
    type: {
      type: String,
      default: "seller",
      immutable: true,
    },

    display_name: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    seller_type: {
      type: String,
      enum: ["ecom", "live", "self", "serve"],
      required: true,
    },
    preferred_web_prefix: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    contact_number: {
      type: String,
      required: true,
      unique: true,
    },
    whatsapp_number: {
      type: String,
    },
    additional_login_number: {
      type: String,
    },
    description: {
      type: String,
    },
    profile_photo: {
      type: String,
    },
    settings: {
      payment_mode: {
        type: [String],
        enum: ["online", "cod", "partial-cod"],
      },
    },

    billing_address: {
      type: BillingAddressSchema,
      required: true,
    },
    pickup_address: {
      type: [PickupAddressSchema],
      required: true,
    },
    return_address: {
      type: ReturnAddressSchema,
    },
    is_same_return_address: {
      type: Boolean,
    },
    is_gst: {
      type: Boolean,
    },
    gst_number: {
      type: String,
    },
    custom_domain: {
      type: String,
    },
    addr_tag_3pl: {
      type: String,
    },
    kyc_details: {
      gst: {
        type: String,
      },
      pan: {
        type: String,
      },
      cheque: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Seller = mongoose.model("Seller", SellerSchema);
