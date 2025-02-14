import { WebsitePageConfig } from "../../../../models/website-page-config/website-page-config.model.js";

const getThemeSettings = async (req, res) => {
  try {
    const seller_website_config_data = await WebsitePageConfig.findOne({
      seller: req?.seller?._id,
    });
    res.status(200).json({
      data: {
        primary_color: seller_website_config_data?.ui_settings?.primary_color,
        font_family: seller_website_config_data?.ui_settings?.font_family,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export { getThemeSettings };
