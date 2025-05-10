import mongoose from "mongoose";
import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { SizeChart } from "../../../models/size-chart/size-chart.model.js";

const deleteSizeChart = async (req, res) => {
  try {
    const sizeChartId = new mongoose.Types.ObjectId(req.params.size_chart_id);

    // Step 1: Get all catalogues affected
    const affectedCatalogues = await Catalogue.find({
      "size_charts.size_chart_id": sizeChartId,
    });

    if (affectedCatalogues.length === 0) {
      return res.status(404).json({ message: "No matching catalogues found" });
    }

    // Step 2: Prepare bulk operations
    const bulkOps = affectedCatalogues.map((catalogue) => {
      // Remove the size chart with the given ID
      const updatedCharts = catalogue.size_charts.filter(
        (chart) => !chart.size_chart_id.equals(sizeChartId)
      );

      // Get the most recent chart by updated_at
      let newActiveId = null;
      if (updatedCharts.length > 0) {
        updatedCharts.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        newActiveId = updatedCharts[0].size_chart_id;
      }

      return {
        updateOne: {
          filter: { _id: catalogue._id },
          update: {
            $set: {
              size_charts: updatedCharts,
              active_size_chart_id: newActiveId,
            },
          },
        },
      };
    });

    // Step 3: Execute bulk update
    await Catalogue.bulkWrite(bulkOps);

    // Step 4: Delete the size chart from the SizeChart collection
    await SizeChart.deleteOne({ _id: sizeChartId });

    res.status(200).json({
      message:
        "Size chart deleted from catalogues and SizeChart collection. Active chart updated.",
    });
  } catch (error) {
    console.error("Error during size chart deletion:", error);
    res.status(500).json({ error: error?.message });
  }
};

export { deleteSizeChart };
