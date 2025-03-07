import { WebsitePageTemplate } from "../../../models/website-page-template/website-page-template.model.js";
import { WebsitePage } from "../../../models/website-page/website-page.model.js";
import { uploadToS3 } from "../../../s3/s3.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const createTemplate = async (req, res) => {
  try {
    const templateData = JSON.parse(req?.body?.templateData);
    const page_id = req?.body?.page_id;

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
      return res
        .status(404)
        .json({ error: "Please enter a valid template type" });

    const page = await WebsitePage.find({ short_id: page_id });
    if (!page) return res.status(500).json({ error: "Not a valid page" });

    switch (type) {
      case "banner":
        handleBannerTemplate(templateData, req, res);
        break;
      case "category_group":
        handleCategoryGroupTemplate(templateData, req, res);
        break;
      case "product_group":
        handleProductGroupTemplate(templateData, req, res);
        break;
      case "category_tabbed":
        handleTabbedCategoryTemplate(templateData, req, res);
        break;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const handleBannerTemplate = async (templateData, req, res) => {
  try {
    const { title, bannerItems } = templateData;
    const page_id = req?.body?.page_id;

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
      (bannerItems ?? [])?.map(async (item, index) => {
        if (req?.files?.[index]) {
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
      },
      { new: true }
    );

    // /********************** Update Website Page Data *********************** */
    await WebsitePage.findOneAndUpdate(
      { short_id: page_id },
      {
        $addToSet: { template_short_ids: createdTemplate.short_id },
      }
    );
    res.status(200).json({ data: "updatedTemplate" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const handleCategoryGroupTemplate = async (templateData, req, res) => {
  try {
    const { title, description, custom_style, categoryGroupItems } =
      templateData;
    const page_id = req?.body?.page_id;

    const createdTemplate = await WebsitePageTemplate.create({
      type: "category_group",
      layout: "carousel",
      short_id: generateShortId(10),
      title,
      description,
      custom_style,
      category_group_data: categoryGroupItems,
      seller: req?.seller?._id,
    });

    const updatedCategoryGroupItems = await Promise.all(
      (categoryGroupItems ?? [])?.map(async (item, index) => {
        if (req?.files?.[index]) {
          const file = req.files[index];

          const { url } = await uploadToS3({
            file,
            key: `${req?.seller?._id}/templates/category-group-${Date.now()}-${
              file.originalname
            }`,
          });
          return {
            ...item,
            img_url: url,
          };
        }
        return {
          ...item,
          img_url: "",
        };
      })
    );

    const updatedTemplate = await WebsitePageTemplate.findByIdAndUpdate(
      createdTemplate._id,
      {
        $set: { category_group_data: updatedCategoryGroupItems },
      },
      { new: true }
    );

    /********************** Update Website Page Data *********************** */
    await WebsitePage.findOneAndUpdate(
      { short_id: page_id },
      {
        $addToSet: { template_short_ids: createdTemplate.short_id },
      }
    );
    res.status(200).json({ data: updatedTemplate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const handleProductGroupTemplate = async (templateData, req, res) => {
  try {
    const {
      title,
      description,
      layout,
      sub_type,
      collection_short_id,
      custom_style,
    } = templateData;
    const page_id = req?.body?.page_id;

    const createdTemplate = await WebsitePageTemplate.create({
      type: "product_group",
      short_id: generateShortId(10),
      title,
      description,
      sub_type,
      layout,
      custom_style,
      product_group_data: { collection_short_id },
      seller: req?.seller?._id,
    });

    await WebsitePage.findOneAndUpdate(
      { short_id: page_id },
      {
        $addToSet: { template_short_ids: createdTemplate.short_id },
      }
    );
    res.status(200).json({ data: createdTemplate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const handleTabbedCategoryTemplate = async (templateData, req, res) => {
  try {
    const { title, description, categoryTabbedItems, custom_style } =
      templateData;
    const page_id = req?.body?.page_id;

    const createdTemplate = await WebsitePageTemplate.create({
      type: "category_tabbed",
      short_id: generateShortId(10),
      title,
      description,
      layout: "carousel",
      custom_style,
      category_tabbed_data: categoryTabbedItems,
      seller: req?.seller?._id,
    });

    await WebsitePage.findOneAndUpdate(
      { short_id: page_id },
      {
        $addToSet: { template_short_ids: createdTemplate.short_id },
      }
    );
    res.status(200).json({ data: createdTemplate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { createTemplate };
