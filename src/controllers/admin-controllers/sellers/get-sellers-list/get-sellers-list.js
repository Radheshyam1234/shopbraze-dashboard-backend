import { Seller } from "../../../../models/user/seller.model.js";

const getSellersList = async (req, res) => {
  try {
    const sellers = await Seller.find({});
    res.status(200).json({ data: sellers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export { getSellersList };
