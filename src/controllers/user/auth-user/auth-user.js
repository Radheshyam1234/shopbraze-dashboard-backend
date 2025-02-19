import { Admin } from "../../../models/user/admin.model.js";
import { Seller } from "../../../models/user/seller.model.js";

const getUserData = async (req, res) => {
  try {
    let admin_data = null;
    let seller_data = null;

    const viewAsSellerId = req.headers["x-view-as"];

    if (viewAsSellerId) {
      if (!req.user_type === "system")
        return res
          .status(403)
          .json({ message: "Access to login as seller is not allowed" });

      seller_data = await Seller.findById(viewAsSellerId).lean();
      // admin_data = await Admin.findOne({
      //   contact_number: req.admin.contact_number,
      // }).lean();
      res.status(200).json({ data: seller_data });
    } else if (req.user_type === "seller") {
      seller_data = await Seller.findOne({
        contact_number: req.seller.contact_number,
      });
      res.status(200).json({ data: seller_data });
    } else if (req.user_type === "system") {
      admin_data = await Admin.findOne({
        contact_number: req.admin.contact_number,
      });
      res.status(200).json({ data: admin_data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getUserData };
