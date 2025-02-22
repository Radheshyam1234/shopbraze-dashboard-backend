import { Seller } from "../../../../models/user/seller.model.js";

const cretateSeller = async (req, res) => {
  try {
    const data = req.body;

    const existingSeller = await Seller.findOne({
      contact_number: data.contact_number,
    });
    if (existingSeller) {
      return res
        .status(400)
        .json({ message: "A seller with this contact number already exists!" });
    }

    console.log(data, "create seller");

    // const seller = await Seller.create({ ...data });
    // if (seller)
    //   res.status(200).json({ message: "Seller created successfully!" });
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

export { cretateSeller };
