import { WebsitePageTemplate } from "../../../models/website-page-template/website-page-template.model.js";
import { WebsitePage } from "../../../models/website-page/website-page.model.js";
import { uploadToS3 } from "../../../s3/s3.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const toggleTemplateVisibility = async (req, res) => {
  try {
    const { templateId } = req?.params;
    const { visibility } = req?.body;

    const updatedTemplate = await WebsitePageTemplate.findByIdAndUpdate(
      templateId,
      { $set: { is_visible: visibility } },
      { new: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.status(200).json({ message: "Saved Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const templateData = JSON.parse(req?.body?.templateData);
    const { template_id } = req?.params;

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

    const template = await WebsitePageTemplate.find({ short_id: template_id });
    if (!template)
      return res.status(500).json({ error: "Not a valid template" });

    switch (type) {
      case "banner":
        handleBannerTemplate(templateData, req, res);
        break;
      case "category_group":
        handleCategoryGroupTemplate(templateData, req, res);
        break;
      case "product_group":
        handleUpdateProductGroupTemplate(templateData, req, res);
        break;
      case "category_tabbed":
        handleUpdateTabbedCategoryTemplate(templateData, req, res);
        break;
      case "testimonial":
        handleUpdateTestimonialTemplate(templateData, req, res);
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

const handleUpdateProductGroupTemplate = async (templateData, req, res) => {
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

    const { template_id } = req?.params;

    const updatedTemplate = await WebsitePageTemplate.findOneAndUpdate(
      { short_id: template_id },
      {
        $set: {
          title,
          description,
          layout,
          sub_type,
          collection_short_id,
          custom_style,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ data: updatedTemplate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const handleUpdateTabbedCategoryTemplate = async (templateData, req, res) => {
  try {
    const { title, description, categoryTabbedItems, custom_style } =
      templateData;
    const { template_id } = req?.params;

    const updatedTemplate = await WebsitePageTemplate.findOneAndUpdate(
      { short_id: template_id },
      {
        $set: {
          title,
          description,
          category_tabbed_data: categoryTabbedItems,
          custom_style,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ data: updatedTemplate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const handleUpdateTestimonialTemplate = async (templateData, req, res) => {
  try {
    const { title, layout, template_settings, custom_style } = templateData;
    const { template_id } = req?.params;

    const updatedTemplate = await WebsitePageTemplate.findOneAndUpdate(
      { short_id: template_id },
      {
        $set: {
          title,
          layout,
          template_settings,
          custom_style,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ data: updatedTemplate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { updateTemplate, toggleTemplateVisibility };
