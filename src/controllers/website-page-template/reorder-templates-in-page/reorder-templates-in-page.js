import { WebsitePage } from "../../../models/website-page/website-page.model.js";

const reorderTemplatesInPage = async (req, res) => {
  try {
    const { page_id, template_ids } = req?.body;

    const pageInfo = await WebsitePage.findOne({ short_id: page_id });

    if (!pageInfo) res.status(500).json({ error: " Invalid Request" });

    await WebsitePage.findOneAndUpdate(
      { short_id: page_id },
      { $set: { template_short_ids: template_ids } }
    );

    res.status(200).json({ message: "Saved Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { reorderTemplatesInPage };
