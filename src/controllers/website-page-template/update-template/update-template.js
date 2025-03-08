import { WebsitePageTemplate } from "../../../models/website-page-template/website-page-template.model.js";

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

export { toggleTemplateVisibility };
