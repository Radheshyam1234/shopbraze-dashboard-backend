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
    const newData = req?.body;

    const existingCollection = await Collection.findOne({
      _id: collectionId,
    });
    if (!existingCollection) {
      return res.status(404).json({ error: "Collection not found" });
    }
    const updatedData = { ...existingCollection.toObject(), ...newData };

    await Collection.updateOne(
      { _id: collectionId },
      { $set: updatedData },
      { runValidators: true }
    );

    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export { toggleCollectionVisibility, updateCollectionDetails };
