import { WebsitePageTemplate } from "../../../models/website-page-template/website-page-template.model.js";

const getTemplatesInPage = async (req, res) => {
  try {
    const { page_type } = req?.query;
    if (
      ![
        "home_page",
        "product_page",
        "order_status_page",
        "featured_page",
      ].includes(page_type)
    )
      res.status(500).json({ error: "Invalid page type" });

    const templates = await WebsitePageTemplate.find({});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { getTemplatesInPage };
