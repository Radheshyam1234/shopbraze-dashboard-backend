import { WebsitePageTemplate } from "../../../models/website-page-template/website-page-template.model.js";
import { uploadToS3 } from "../../../s3/s3.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const createTemplate = async (req, res) => {
  try {
    const templateData = JSON.parse(req?.body?.templateData);
    const { type } = templateData;

    if (
      ![
        "banner",
        "category_group",
        "product_group",
        "category_tabbed",
        "testimonial",
      ].includes(type)
    )
      res.status(500).json({ error: "Please enter a valid template type" });

    switch (type) {
      case "banner":
        handlBannerTemplate(templateData, req, res);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const handlBannerTemplate = async (templateData, req, res) => {
  try {
    const { title, bannerItems } = templateData;

    const createdTemplate = await WebsitePageTemplate.create({
      type: "banner",
      short_id: generateShortId(10),
      title,
      layout: "carousel",
      seller: req?.seller?._id,
      banner_data: bannerItems?.map((item) => ({
        link: item.link,
        img_url: "",
      })),
    });

    const updatedBannerItems = await Promise.all(
      bannerItems?.map(async (item, index) => {
        if (req.files?.[index]) {
          const file = req.files[index];

          const { url } = await uploadToS3({
            file,
            key: `${req?.seller?._id}/templates/banner-${Date.now()}-${
              file.originalname
            }`,
          });

          return { link: item.link, img_url: url };
        }
        return { link: item.link, img_url: "" };
      })
    );

    const updatedTemplate = await WebsitePageTemplate.findByIdAndUpdate(
      createdTemplate._id,
      {
        $set: { banner_data: updatedBannerItems },
      }
    ).exec();

    res.status(200).json({ data: updatedTemplate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { createTemplate };
