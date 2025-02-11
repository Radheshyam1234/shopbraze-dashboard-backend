import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { Collection } from "../../../models/collection/collection.model.js";

const deleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const collection = await Collection.findOne({ _id: collectionId });
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const catalogues_to_remove_collection = await Catalogue.find({
      collections_to_add: collection.short_id,
    });

    if (catalogues_to_remove_collection?.length > 0) {
      const bulkOps = catalogues_to_remove_collection?.map((catalogue) => ({
        updateOne: {
          filter: { _id: catalogue._id },
          update: { $pull: { collections_to_add: collection.short_id } },
        },
      }));
      await Catalogue.bulkWrite(bulkOps);
    }
    await Collection.deleteOne({ _id: collectionId });
    return res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export { deleteCollection };
