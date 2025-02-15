import { WebsitePageConfig } from "../../../../models/website-page-config/website-page-config.model.js";

const updateThemeSettings = async (req, res) => {
  try {
    const newData = req?.body;
    const seller_website_config_data = await WebsitePageConfig.findOne({
      seller: req?.seller?._id,
    });
    if (!seller_website_config_data) {
      return res
        .status(404)
        .json({ message: "Website config not found for this user" });
    }

    await WebsitePageConfig.findOneAndUpdate(
      { _id: seller_website_config_data._id },
      {
        $set: Object.keys(newData)?.reduce((acc, key) => {
          acc[`ui_settings.${key}`] = newData[key];
          return acc;
        }, {}),
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Theme Updated SuccessFully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const resetThemeSettings = async (req, res) => {
  try {
    const defaultData = {
      primary_color: {
        red: 0,
        green: 147,
        blue: 153,
      },
      font_family: {
        title1: {
          name: "ABeeZee",
          weight: "400",
        },
        title2: {
          name: "Pompiere",
          weight: "400",
        },
        title3: {
          name: "Qwigley",
          weight: "400",
        },
        heading: {
          name: "Pontano Sans",
          weight: "400",
        },
        body: {
          name: "Noto Serif Kannada",
          weight: "500",
        },
      },
    };

    const seller_website_config_data = await WebsitePageConfig.findOne({
      seller: req?.seller?._id,
    });
    if (!seller_website_config_data) {
      return res
        .status(404)
        .json({ message: "Website config not found for this user" });
    }

    await WebsitePageConfig.findOneAndUpdate(
      { _id: seller_website_config_data._id },
      {
        $set: {
          "ui_settings.primary_color": defaultData.primary_color,
          "ui_settings.font_family": defaultData.font_family,
        },
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Theme Updated SuccessFully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export { updateThemeSettings, resetThemeSettings };
