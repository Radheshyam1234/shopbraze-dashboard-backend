import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { SizeChart } from "../../../models/size-chart/size-chart.model.js";

const updateSizeCharts = async (req, res) => {
  try {
    const { size_chart_id } = req.params;
    const imageFile = req.file;
    const parsedData = JSON.parse(req.body.data || "{}");

    console.log(parsedData, "parsedData");

    const {
      name,
      type,
      unit_labels,
      data_by_unit,
      product_short_ids,
      unit_labels_conversion_factor,
    } = parsedData;

    // let static_type_image_url = "";
    // if (imageFile) {
    //   const { url } = await uploadToS3({
    //     imageFile,
    //     key: `${req?.seller?._id}/size-charts/size-chart-${Date.now()}-${imageFile.originalname}`,
    //   });
    //   static_type_image_url = url;
    // }

    const static_type_image_url = ""; // Placeholder until image upload is enabled

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
        update: { $set: { size_data_by_unit: data_by_unit } },
      },
    }));

    if (bulkOps?.length) {
      await Catalogue.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Size chart updated" });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};

export { updateSizeCharts };
