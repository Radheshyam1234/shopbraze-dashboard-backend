import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { Collection } from "../../../models/collection/collection.model.js";

const getCollections = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const collections = await Collection.find({ seller: req.seller._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalDocuments = await Collection.countDocuments({
      seller: req.seller._id,
    });

    res.status(200).json({
      data: {
        collections,
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit),
        totalItems: totalDocuments,
      },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getCollectionById = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const collection = await Collection.findOne({ _id: collectionId });
    if (collection) {
      const associated_catalogues = await Catalogue.find({
        collections_to_add: collection.short_id,
      }).lean();
      res.status(200).json({
        data: {
          collection_details: collection,
          products: associated_catalogues,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { getCollections, getCollectionById };
