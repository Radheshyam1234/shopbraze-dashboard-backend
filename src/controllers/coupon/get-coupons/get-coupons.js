import { Coupon } from "../../../models/coupon/coupon.model.js";

const getAllCoupons = async (req, res) => {
  try {
    const couponsData = await Coupon.find({
      seller: req?.seller?._id,
    }).select("-createdAt -updatedAt -seller");
    return res.status(200).json({ data: couponsData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { getAllCoupons };
