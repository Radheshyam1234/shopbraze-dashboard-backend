import { BulkUploadReport } from "../../models/reports/reports.model.js";

const getCatalogueReports = async (req, res) => {
  try {
    const reports = await BulkUploadReport.find({ seller: req.seller._id })
      .select("-_id -createdAt -updatedAt")
      .lean();
    res.status(200).json({ data: reports });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { getCatalogueReports };
