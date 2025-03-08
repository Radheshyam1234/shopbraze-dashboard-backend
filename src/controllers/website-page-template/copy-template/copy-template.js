import { WebsitePageTemplate } from "../../../models/website-page-template/website-page-template.model.js";
import { WebsitePage } from "../../../models/website-page/website-page.model.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const copyTemplate = async (req, res) => {
  try {
    const { templateId, pageId } = req.params;

    const page = await WebsitePage.findOne({ short_id: pageId });
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    const originalTemplate = await WebsitePageTemplate.findOne({
      short_id: templateId,
    }).lean();

    if (!originalTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }

    const { _id, ...templateData } = originalTemplate;
    const createdTemplate = await WebsitePageTemplate.create({
      ...templateData,
      short_id: generateShortId(10),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await WebsitePage.findOneAndUpdate(
      { short_id: pageId },
      { $addToSet: { template_short_ids: createdTemplate.short_id } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Template copied successfully", data: createdTemplate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export { copyTemplate };
