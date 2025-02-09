import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { Collection } from "../../../models/collection/collection.model.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const createCollection = async (req, res) => {
  try {
    const data = req.body;
    const short_id = generateShortId(8);
    const new_collection = await Collection.create({
      ...data,
      name: data?.name?.toUpperCase(),
      short_id,
      seller: req.seller._id,
    });

    const catalogues_to_add = await Catalogue.find({
      product_short_id: { $in: req.body.product_short_ids },
    }).lean();

    if (catalogues_to_add.length === 0) {
      return res.status(404).json({ error: "No matching catalogues found" });
    }

    // Addition of newly create collectionId to collections_to_add field of catalogue
    const bulkOps = catalogues_to_add.map((catalogue) => ({
      updateOne: {
        filter: { _id: catalogue._id },
        update: { $addToSet: { collections_to_add: new_collection.short_id } },
      },
    }));
    await Catalogue.bulkWrite(bulkOps);

    res.status(200).json({ message: "Collection created successfully!" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { createCollection };
