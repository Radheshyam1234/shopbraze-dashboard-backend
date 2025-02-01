import { Collection } from "../../models/collection/collection.model.js";
import { nanoid } from "nanoid";
import { generateShortId } from "../../utils/generate-short-id.js";

const createCollection = async (req, res) => {
  try {
    const data = req.body;
    const short_id = generateShortId(8);
    const collection = await Collection.create({
      ...data,
      name: data?.name?.toUpperCase(),
      short_id,
      seller: req.seller._id,
    });
    if (collection)
      res.status(200).json({ message: "Collection created successfully!" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ seller: req.seller._id });
    res.status(200).json({ data: collections });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { createCollection, getCollections };
