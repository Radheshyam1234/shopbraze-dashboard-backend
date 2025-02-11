import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { Collection } from "../../../models/collection/collection.model.js";
import { generateShortId } from "../../../utils/generate-short-id.js";
import csvtojson from "csvtojson";

const createCollectionsInBulk = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const collection_name = req?.body?.name;
    const csvString = req?.file?.buffer?.toString("utf-8");
    const jsonArray = await csvtojson().fromString(csvString);

    const short_id = generateShortId(8);
    const new_collection = await Collection.create({
      name: collection_name?.toUpperCase(),
      short_id,
      type: "bulk_upload",
      seller: req.seller._id,
    });

    const product_codes_from_request = jsonArray?.map(
      (item) => item?.product_id
    );
    const catalogues_to_add = await Catalogue.find({
      product_code: { $in: product_codes_from_request },
    }).lean();

    if (catalogues_to_add.length === 0) {
      return res.status(404).json({ error: "No matching catalogues found" });
    }

    // // Addition of newly create collectionId to collections_to_add field of catalogue
    const bulkOps = catalogues_to_add.map((catalogue) => ({
      updateOne: {
        filter: { _id: catalogue._id },
        update: { $addToSet: { collections_to_add: new_collection.short_id } },
      },
    }));
    await Catalogue.bulkWrite(bulkOps);

    res.status(200).json({ message: "Collection created successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export { createCollectionsInBulk };
