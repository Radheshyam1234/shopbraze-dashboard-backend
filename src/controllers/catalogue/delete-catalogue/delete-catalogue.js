import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { uploadToS3, deleteFromS3 } from "../../../s3/s3.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const deleteCatalogue = async (req, res) => {
  console.log(req.body);
};

export { deleteCatalogue };
