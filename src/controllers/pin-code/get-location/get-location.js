import { PinCode } from "../../../models/pin-code/pin-code.model.js";

const getLocationByPinCode = async (req, res) => {
  try {
    const { pincode } = req.params;
    const result = await PinCode.findOne(
      { pincode: pincode },
      { _id: 0, district: 1, state: 1 }
    );
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
    console.log(error);
  }
};

export { getLocationByPinCode };
