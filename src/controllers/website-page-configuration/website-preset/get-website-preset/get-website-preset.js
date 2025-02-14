import { WebsitePageConfig } from "../../../../models/website-page-config/website-page-config.model.js";

const getWebsitePreset = async (req, res) => {
  try {
    const seller_website_config_data = await WebsitePageConfig.findOne({
      seller: req?.seller?._id,
    });
    res.status(200).json({
      data: {
        sale_event: seller_website_config_data?.sale_event,
        selected_website_theme:
          seller_website_config_data?.selected_website_theme,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export { getWebsitePreset };
