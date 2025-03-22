import { Coupon } from "../../../models/coupon/coupon.model.js";

const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req?.params;
    const updatedData = req?.body;
    if (!couponId) return res.status(404).json({ error: "Coupon Not Found" });

    const couponData = await Coupon.findOne({ short_id: couponId });
    if (!couponData) return res.status(404).json({ error: "Coupon Not Found" });

    await Coupon.findOneAndUpdate(
      { short_id: couponId },
      {
        $set: {
          ...updatedData,
        },
        runValidators: true,
      }
    );
    return res.status(200).json({ message: "Coupon Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { updateCoupon };
