import { Coupon } from "../../../models/coupon/coupon.model.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const createCoupon = async (req, res) => {
  try {
    const couponData = req?.body;
    await Coupon.create({
      ...couponData,
      short_id: generateShortId(10),
      seller: req?.seller?._id,
    });
    return res.status(200).json({ message: "Coupon Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { createCoupon };
