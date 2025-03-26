import { Seller } from "../models/user/seller.model.js";
import { Admin } from "../models/user/admin.model.js";
import { promisify } from "util";

const verifyAuth = async (req, res, next) => {
  try {
    // The session ID is already stored in `req.sessionID` by express-session
    const rawSessionId = decodeURIComponent(req.sessionID)
      ?.split(".")?.[0]
      .replace("s:", "");

    if (!rawSessionId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No session ID found" });
    }

    // ✅ Fetch session from MongoDB using the session ID
    const sessionStore = req.sessionStore;
    const getSession = promisify(sessionStore.get).bind(sessionStore);
    const sessionData = await getSession(rawSessionId);

    if (!sessionData) {
      return res.status(401).json({ message: "Session expired or not found" });
    }

    // ✅ IP & User-Agent Check
    const requestIP = req.ip || req.connection.remoteAddress;
    const requestUserAgent = req.headers["user-agent"];

    // if (
    //   sessionData?.user?.ip !== requestIP
    //   || sessionData?.user?.userAgent !== requestUserAgent
    // ) {
    //   return res.status(401).json({ message: "Session hijacking detected" });
    // }

    // If Admin is trying to get data on behalf of seller
    const viewAsSellerId = req.headers["x-view-as"];

    // ✅ Attach user to request object based on type (admin or seller)
    if (sessionData?.user?.type === "system") {
      const admin = await Admin.findOne({
        contact_number: sessionData.user.contact_number,
      });
      req.user_type = "system";
      req.admin = admin;

      if (viewAsSellerId) {
        const seller = await Seller.findOne({
          _id: viewAsSellerId,
        });
        req.seller = seller;
      }
    } else if (sessionData?.user?.type === "seller") {
      const seller = await Seller.findOne({
        contact_number: sessionData.user.contact_number,
      });
      req.user_type = "seller";
      req.seller = seller;
    }

    // If user is neither an admin nor a seller, deny access
    if (!req.admin && !req.seller) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export { verifyAuth };
