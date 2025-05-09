import { SizeChart } from "../../../models/size-chart/size-chart.model.js";

const getSizeCharts = async (req, res) => {
  try {
    const sizeChartsData = await SizeChart.find({
      seller: req?.seller?._id,
    }).select("-createdAt -updatedAt -seller");
    res.status(200).json({ data: sizeChartsData });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};

export { getSizeCharts };
