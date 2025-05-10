import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { SizeChart } from "../../../models/size-chart/size-chart.model.js";

const createSizeChart = async (req, res) => {
  try {
    const imageFile = req.file;
    const parsedData = JSON.parse(req.body.data || "{}");

    const {
      name,
      type,
      unit_labels,
      data_by_unit,
      product_short_ids,
      unit_labels_conversion_factor,
    } = parsedData;

    // if (imageFile) {
    //   const { url } = await uploadToS3({
    //     imageFile,
    //     key: `${req?.seller?._id}/size-charts/size-chart-${Date.now()}-${
    //       imageFile.originalname
    //     }`,
    //   });
    //   static_type_image_url = url;
    // }
    const static_type_image_url = "";

    const newSizeChart = await SizeChart.create({
      name,
      type,
      unit_labels,
      unit_labels_conversion_factor,
      data_by_unit,
      product_short_ids,
      seller: req?.seller?._id,
      static_type_image_url,
    });

    const bulkOps = product_short_ids?.map((productShortId) => ({
      updateOne: {
        filter: { product_short_id: productShortId },
        update: {
          $push: {
            size_charts: {
              size_chart_id: newSizeChart._id,
              data_by_unit,
              updated_at: new Date(),
            },
          },
          $set: {
            active_size_chart_id: newSizeChart._id,
          },
        },
      },
    }));

    await Catalogue.bulkWrite(bulkOps);

    return res.status(201).json({ message: "Size chart created" });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};

export { createSizeChart };
