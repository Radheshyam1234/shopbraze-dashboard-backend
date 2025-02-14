import { WebsitePageConfig } from "../../../../models/website-page-config/website-page-config.model.js";

const updateWebsitePreset = async (req, res) => {
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
      { $set: newData },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Presets Updated SuccessFully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export { updateWebsitePreset };
