import { WebsitePageTemplate } from "../../../models/website-page-template/website-page-template.model.js";
import { WebsitePage } from "../../../models/website-page/website-page.model.js";
import { deleteFromS3 } from "../../../s3/s3.js";

const deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    const templateInfo = await WebsitePageTemplate.findById(templateId);
    if (!templateInfo) {
      return res.status(404).json({ error: "No template found" });
    }

    // Remove template short_id from all pages where it exists
    await WebsitePage.updateMany(
      { template_short_ids: templateInfo.short_id },
      { $pull: { template_short_ids: templateInfo.short_id } }
    );

    // Delete the template and images (from s3 store) itself

    await deleteImagesFromS3Store(templateInfo);
    await WebsitePageTemplate.findByIdAndDelete(templateId);

    res.status(200).json({ message: "Template Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteImagesFromS3Store = async (templateInfo) => {
  let mediaToDelete = [];
  if (templateInfo.type === "banner") {
    mediaToDelete = templateInfo?.banner_data?.map((item) => item?.img_url);
  }

  if (mediaToDelete?.length > 0) {
    await Promise.all(mediaToDelete?.map((url) => deleteFromS3(url)));
  }
};

export { deleteTemplate };
