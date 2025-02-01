import { Catalogue } from "../../../models/catalogue/catalogue.model.js";

const getCatalogues = async (req, res) => {
  try {
    const catalogues = await Catalogue.find({ seller: req.seller._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ data: catalogues });
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
