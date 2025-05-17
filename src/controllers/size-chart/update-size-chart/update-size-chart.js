import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { SizeChart } from "../../../models/size-chart/size-chart.model.js";
import { uploadToS3 } from "../../../s3/s3.js";

const updateSizeCharts = async (req, res) => {
  try {
    const { size_chart_id } = req.params;
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

    let static_type_image_url = "";
    if (imageFile) {
      const { url } = await uploadToS3({
        file: imageFile,
        key: `${req?.seller?._id}/size-charts/size-chart-${Date.now()}-${
          imageFile.originalname
        }`,
      });
      static_type_image_url = url;
    }

    const updatedSizeChart = await SizeChart.findByIdAndUpdate(
      size_chart_id,
      {
        name,
        type,
        unit_labels,
        unit_labels_conversion_factor,
        data_by_unit,
        product_short_ids,
        static_type_image_url,
      },
      { new: true }
    );

    if (!updatedSizeChart) {
      return res.status(404).json({ message: "Size chart not found" });
    }

    const bulkOps = product_short_ids?.map((productShortId) => ({
      updateOne: {
        filter: { product_short_id: productShortId },
        update: {
          $pull: {
            size_charts: { size_chart_id },
          },
        },
      },
    }));

    const pushOps = product_short_ids?.map((productShortId) => ({
      updateOne: {
        filter: { product_short_id: productShortId },
        update: {
          $push: {
            size_charts: {
              size_chart_id,
              data_by_unit,
              updated_at: new Date(),
            },
          },
          $set: {
            active_size_chart_id: size_chart_id,
          },
        },
      },
    }));

    if (bulkOps?.length) await Catalogue.bulkWrite(bulkOps);
    if (pushOps?.length) await Catalogue.bulkWrite(pushOps);

    res.status(200).json({ message: "Size chart updated" });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};

export { updateSizeCharts };
