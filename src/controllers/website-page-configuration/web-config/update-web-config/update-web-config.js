import { WebsitePageConfig } from "../../../../models/website-page-config/website-page-config.model.js";
import { uploadToS3 } from "../../../../s3/s3.js";
import _ from "lodash";

const updateWebConfig = async (req, res) => {
  try {
    const { seller } = req;
    const seller_website_config_data = await WebsitePageConfig.findOne({
      seller: req?.seller?._id,
    });

    const parsedData = JSON.parse(req.body.data || "{}");

    const logoFile = req.files?.logo?.[0];
    const faviconFile = req.files?.favicon?.[0];

    if (logoFile) {
      const { url: logoUrl } = await uploadToS3({
        file: logoFile,
        key: `${seller._id}/web-config/logo-${Date.now()}-${
          logoFile.originalname
        }`,
      });
      parsedData.logo = logoUrl;
    }

    if (faviconFile) {
      const { url: faviconUrl } = await uploadToS3({
        file: faviconFile,
        key: `${seller._id}/web-config/favicon-${Date.now()}-${
          faviconFile.originalname
        }`,
      });
      parsedData.favicon = faviconUrl;
    }

    const mergedData = _.merge(
      {},
      seller_website_config_data?.toObject?.() || {},
      parsedData
    );

    const updatedConfig = await WebsitePageConfig.findOneAndUpdate(
      { seller: seller._id },
      { $set: mergedData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating web config:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export { updateWebConfig };
