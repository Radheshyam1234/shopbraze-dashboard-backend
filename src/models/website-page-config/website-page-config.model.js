import mongoose, { Schema } from "mongoose";
const { ObjectId, Mixed } = mongoose.Schema.Types;

const WebsitePageConfigSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    favicon: {
      type: String,
    },
    facebook_url: {
      type: String,
    },
    instagram_url: {
      type: String,
    },
    customer_support_number: {
      type: String,
    },
    whatsapp_number: {
      type: String,
    },
    customer_support_time: {
      is_24_7_available: {
        type: Boolean,
      },
    },
    contact_us: {
      show_customer_support_number: {
        type: Boolean,
      },
      show_whatsapp_number: {
        type: Boolean,
      },
      show_customer_support_time: {
        type: Boolean,
      },
      show_email: {
        type: Boolean,
      },
      show_address: {
        type: Boolean,
      },
    },
    confetti_settings: {
      mobile_url: {
        type: String,
      },
      desktop_url: {
        type: String,
      },
      url: {
        type: String,
      },
      enabled: {
        type: Boolean,
      },
      loop_count: {
        type: Number,
      },
    },
    add_to_bag: {
      type: Boolean,
    },
    capture_website_metrics: {
      type: Boolean,
    },
    lowest_price_tag: {
      type: Boolean,
    },
    ui_settings: {
      custom_loader: {
        url: {
          type: String,
        },
        enabled: {
          type: Boolean,
        },
      },
      primary_color: {
        red: {
          type: Number,
        },
        green: {
          type: Number,
        },
        blue: {
          type: Number,
        },
      },
      font_family: {
        title1: {
          name: {
            type: String,
          },
          weight: {
            type: String,
          },
        },
        title2: {
          name: {
            type: String,
          },
          weight: {
            type: String,
          },
        },
        title3: {
          name: {
            type: String,
          },
          weight: {
            type: String,
          },
        },
        heading: {
          name: {
            type: String,
          },
          weight: {
            type: String,
          },
        },
        body: {
          name: {
            type: String,
          },
          weight: {
            type: String,
          },
        },
      },
      coupon_milestone: {
        type: Boolean,
      },
      external_checkout: {
        type: Mixed,
      },
      auto_scroll_banner: {
        type: Boolean,
      },
      auto_scroll_product_card: {
        type: Boolean,
      },
      header_logo_type: {
        type: String,
      },
      product_card_add_to_bag: {
        type: Boolean,
      },
      product_card_layout: {
        type: String,
        enum: ["portrait", "square"],
      },
      show_cod_charges_toast: {
        type: Boolean,
      },
      show_exit_intent: {
        type: Boolean,
      },
      show_lower_rating: {
        type: Boolean,
      },
      show_ratings_on_product_card: {
        type: Boolean,
      },
      show_ratings_on_product_page: {
        type: Boolean,
      },
      show_order_cancel: {
        type: Boolean,
      },
      show_swipe_up_screen: {
        type: Boolean,
      },
      show_whatsapp_connect: {
        type: Boolean,
      },
      checkout_flow_id: {
        type: String,
      },
      image_fit: {
        type: String,
        enum: ["contain", "cover"],
      },
      header_logo_size: {
        type: String,
        enum: ["original", "small", "medium", "large"],
      },
      size_confirmation: {
        type: Boolean,
      },
    },
    whatsapp_connect: {
      is_default_whatsapp_connect_text: {
        type: Boolean,
      },
      product_page: {
        type: Boolean,
      },
      order_related_issue: {
        type: Boolean,
      },
      post_delivery_issue: {
        type: Boolean,
      },
      title: {
        type: String,
      },
      sub_title: {
        type: String,
      },
      cta_text: {
        type: String,
      },
    },
    exit_intent: {
      capture_field: {
        type: String,
      },
    },
    swipe_up_screen: {
      title: {
        type: String,
      },
      title_alignment: {
        type: String,
      },
      title_color: {
        type: String,
      },
      show_title: {
        type: Boolean,
      },
      logo_alignment: {
        type: String,
      },
      show_logo: {
        type: Boolean,
      },
    },
    rating_and_reviews: {
      enable_external_review_sync: {
        type: Boolean,
      },
      enable_sourcewise_ratings: {
        type: Boolean,
      },
    },
    timer_settings: {
      show_timer: {
        type: Boolean,
      },
      discount_split_percentage: {
        type: Number,
      },
      timer_validity: {
        type: Number,
      },
    },
    app_announcement: {
      open_in_app_badge: {
        type: Boolean,
      },
      open_in_app_strip: {
        type: Boolean,
      },
    },
    acko_verified: {
      type: Boolean,
    },
    additional_address_fields: [
      {
        type: Mixed,
      },
    ],
    category_tags: [
      {
        type: String,
      },
    ],
    checkout_type: {
      type: String,
    },
    cover_photo: {
      type: String,
    },
    default_payment_mode: {
      type: String,
    },
    product_quality_trust_markers: [
      {
        type: String,
      },
    ],
    push_for_online_payments: {
      type: Boolean,
    },
    sale_event: {
      type: Boolean,
    },
    selected_website_theme: {
      type: String,
    },
    web_otf_enabled: {
      type: Boolean,
    },
    google_search_verification_code: {
      type: String,
    },
    policies: {
      _id: false,
      use_default_privacy_policy: {
        type: Boolean,
        default: true,
      },
      use_default_return_policy: {
        type: Boolean,
        default: true,
      },
      use_default_terms_and_conditions: {
        type: Boolean,
        default: true,
      },
      use_default_shipping_policy: {
        type: Boolean,
        default: true,
      },
      use_default_about_us: {
        type: Boolean,
        default: true,
      },
      policies_text_obj: {
        _id: false,
        privacy_policy_text: {
          type: String,
          default: "",
        },
        return_policy_text: {
          type: String,
          default: "",
        },
        terms_and_conditions_text: {
          type: String,
          default: "",
        },
        shipping_policy_text: {
          type: String,
          default: "",
        },
        about_us_text: { type: String, default: "" },
      },
    },

    seller: { type: ObjectId, ref: "Seller", required: true },
  },
  {
    timestamps: true,
  }
);

export const WebsitePageConfig = mongoose.model(
  "WebsitePageConfig",
  WebsitePageConfigSchema
);
