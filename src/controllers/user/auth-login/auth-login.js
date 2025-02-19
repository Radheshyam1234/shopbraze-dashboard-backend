import { Admin } from "../../../models/user/admin.model.js";
import { Seller } from "../../../models/user/seller.model.js";

const loginUser = async (req, res) => {
  try {
    const { contact_number } = req.body;

    // 🔹 Check if user exists
    const user_is_seller = await Seller.findOne({ contact_number });
    const user_is_admin = await Admin.findOne({ contact_number });

    if (!user_is_seller && !user_is_admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const requestIP = req.ip || req.connection.remoteAddress;
    const requestUserAgent = req.headers["user-agent"];

    req.session.user = {
      contact_number: user_is_admin
        ? user_is_admin.contact_number
        : user_is_seller.contact_number,
      type: user_is_admin ? "system" : "seller",
      ip: requestIP,
      userAgent: requestUserAgent,
    };

    res.status(200).json({ data: user_is_seller || user_is_admin });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export { loginUser };
