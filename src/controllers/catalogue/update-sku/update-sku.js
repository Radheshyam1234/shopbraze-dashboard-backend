import { Catalogue } from "../../../models/catalogue/catalogue.model.js";

const updateCatalogueSkuData = async (req, res) => {
  try {
    const { catalogueShortId } = req.params;
    const { sku_data } = req.body;

    const catalogue = await Catalogue.findOne({
      product_short_id: catalogueShortId,
    });
    if (!catalogue) {
      return res.status(404).json({ error: "Catalogue not found" });
    }

    await Catalogue.updateOne(
      { product_short_id: catalogueShortId },
      {
        $set: {
          customer_skus: sku_data,
        },
      },
      { runValidators: true }
    );
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    if (error.code === 11000) {
      const fieldName = Object.keys(error?.keyValue)?.[0];
      const duplicateValue = error?.keyValue?.[fieldName];
      return res.status(400).json({
        error: `Please enter a different value for ${fieldName}. The value "${duplicateValue}" is already taken.`,
      });
    }
    console.log(error);
    res.status(500).json({ error });
  }
};

export { updateCatalogueSkuData };
