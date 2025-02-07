import { Catalogue } from "../../../models/catalogue/catalogue.model.js";

const getCatalogues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const catalogues = await Catalogue.find({ seller: req.seller._id })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalDocuments = await Catalogue.countDocuments({
      seller: req.seller._id,
    });

    res.status(200).json({
      data: {
        catalogues,
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit),
        totalItems: totalDocuments,
      },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getCatalogueById = async (req, res) => {
  try {
    const { catalogueId } = req.params;
    const catalogue = await Catalogue.findOne({ _id: catalogueId });
    res.status(200).json({ data: catalogue });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { getCatalogues, getCatalogueById };
