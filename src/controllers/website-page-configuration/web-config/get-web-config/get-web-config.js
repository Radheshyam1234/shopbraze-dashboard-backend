import { WebsitePageConfig } from "../../../../models/website-page-config/website-page-config.model.js";

const getWebConfig = async (req, res) => {
  try {
    const seller_website_config_data = await WebsitePageConfig.findOne({
      seller: req?.seller?._id,
    }).select({
      name: 1,
      description: 1,
      logo: 1,
      favicon: 1,
      facebook_url: 1,
      instagram_url: 1,
      whatsapp_number: 1,
      customer_support_number: 1,
      add_to_bag: 1,
      capture_website_metrics: 1,
      "ui_settings.auto_scroll_banner": 1,
      "ui_settings.auto_scroll_product_card": 1,
      "ui_settings.product_card_layout": 1,
      "ui_settings.product_card_add_to_bag": 1,
      "ui_settings.show_order_cancel": 1,
      "ui_settings.size_confirmation": 1,
      "ui_settings.image_fit": 1,
      "ui_settings.header_logo_size": 1,
      category_tags: 1,
      "policies.use_default_privacy_policy": 1,
      "policies.use_default_return_policy": 1,
      "policies.use_default_terms_and_conditions": 1,
      "policies.use_default_shipping_policy": 1,
      "policies.use_default_about_us": 1,
      "policies.policies_text_obj.privacy_policy_text": 1,
      "policies.policies_text_obj.return_policy_text": 1,
      "policies.policies_text_obj.terms_and_conditions_text": 1,
      "policies.policies_text_obj.shipping_policy_text": 1,
      "policies.policies_text_obj.about_us_text": 1,
    });

    if (!seller_website_config_data) {
      return res
        .status(404)
        .json({ message: "Website configuration not found." });
    }

    res.status(200).json({ data: seller_website_config_data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { getWebConfig };
