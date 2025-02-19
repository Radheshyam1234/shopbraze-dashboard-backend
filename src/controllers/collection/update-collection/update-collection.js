import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { Collection } from "../../../models/collection/collection.model.js";

const toggleCollectionVisibility = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { new_status } = req?.body;
    const collection = await Collection.findOne({ _id: collectionId });
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }
    collection.is_visible = new_status;
    await collection.save();
    return res.status(200).json({ message: "Collection Visibility Changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const updateCollectionDetails = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { product_short_ids, ...newData } = req?.body;

    const existingCollection = await Collection.findOne({
      _id: collectionId,
    });
    if (!existingCollection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    await Collection.updateOne(
      { _id: collectionId },
      { $set: newData },
      { runValidators: true }
    );

    const collectionShortId = existingCollection.short_id;

    if (product_short_ids?.length) {
      await Catalogue.bulkWrite([
        // Remove collectionShortId from all catalogues that are NOT in product_short_ids
        {
          updateMany: {
            filter: {
              collections_to_add: collectionShortId,
              product_short_id: { $nin: product_short_ids },
            },
            update: { $pull: { collections_to_add: collectionShortId } },
          },
        },
        // Add collectionShortId to catalogues that should have it
        {
          updateMany: {
            filter: {
              product_short_id: { $in: product_short_ids },
            },
            update: { $addToSet: { collections_to_add: collectionShortId } }, // Prevents duplicates
          },
        },
      ]);
    }

    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export { toggleCollectionVisibility, updateCollectionDetails };
