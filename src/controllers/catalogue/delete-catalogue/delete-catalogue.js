import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { uploadToS3, deleteFromS3 } from "../../../s3/s3.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const deleteCatalogue = async (req, res) => {
  try {
    const { catalogueId } = req.params;
    const catalogue = await Catalogue.findOne({ _id: catalogueId });
    if (!catalogue) {
      return res.status(404).json({ error: "Catalogue not found" });
    }

    const imagesToDelete =
      catalogue.media?.images.map((image) => image?.url) || [];
    const videosToDelete =
      catalogue.media?.videos.map((video) => video?.url) || [];
    const mediaToDelete = [...imagesToDelete, ...videosToDelete];

    if (mediaToDelete?.length > 0) {
      await Promise.all(mediaToDelete?.map((url) => deleteFromS3(url)));
    }
    await Catalogue.deleteOne({ _id: catalogueId });
    return res.status(200).json({ message: "Catalogue deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { deleteCatalogue };
