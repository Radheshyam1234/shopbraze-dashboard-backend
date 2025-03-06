import { WebsitePage } from "../../../models/website-page/website-page.model.js";

const reorderTemplatesInPage = async (req, res) => {
  try {
    const { page_id, template_ids } = req?.body;

    if (!page_id || !Array.isArray(template_ids)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const updatedPageInfo = await WebsitePage.findOneAndUpdate(
      { short_id: page_id },
      { $set: { template_short_ids: template_ids } },
      { new: true }
    );

    if (!updatedPageInfo)
      return res.status(404).json({ error: "Invalid request" });

    res.status(200).json({ message: "Saved Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { reorderTemplatesInPage };
