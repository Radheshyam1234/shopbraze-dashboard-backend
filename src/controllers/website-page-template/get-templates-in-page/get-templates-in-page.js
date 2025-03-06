import { WebsitePageTemplate } from "../../../models/website-page-template/website-page-template.model.js";
import { WebsitePage } from "../../../models/website-page/website-page.model.js";

const getTemplatesInPage = async (req, res) => {
  try {
    const { page_type } = req?.query;
    const { pageId } = req?.params;
    if (
      ![
        "home_page",
        "product_page",
        "order_status_page",
        "featured_page",
      ].includes(page_type)
    )
      res.status(500).json({ error: "Invalid page type" });

    const pageInfo = await WebsitePage.findOne({ short_id: pageId });
    if (!pageInfo) res.status(500).json({ error: "Page not found" });

    const templates = await WebsitePageTemplate.find({
      short_id: { $in: pageInfo?.template_short_ids },
    });

    // Sort templates in order
    const sortedTemplates = pageInfo?.template_short_ids
      ?.map((shortId) =>
        templates.find((template) => template?.short_id === shortId)
      )
      .filter(Boolean);

    res.status(200).json({ data: sortedTemplates });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { getTemplatesInPage };
