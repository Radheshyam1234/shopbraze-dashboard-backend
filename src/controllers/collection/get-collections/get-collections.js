import { Collection } from "../../../models/collection/collection.model.js";

const getCollections = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const collections = await Collection.find({ seller: req.seller._id })
      .sort({ updatedAt: -1 })
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

export { getCollections };
