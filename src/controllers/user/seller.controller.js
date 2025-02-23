import { Seller } from "../../models/user/seller.model.js";
import { uploadToS3 } from "../../s3/s3.js";

const createSeller = async (req, res) => {
  try {
    let sellerDetails = JSON.parse(req.body?.sellerDetails);
    const gstFile = req.files?.["gst_file"]?.[0];
    const panFile = req.files?.["pan_file"]?.[0];
    const chequeFile = req.files?.["cheque_file"]?.[0];

    const existingSeller = await Seller.findOne({
      contact_number: sellerDetails.contact_number,
    });
    if (existingSeller) {
      return res
        .status(400)
        .json({ message: "A seller with this contact number already exists!" });
    }

    // CHeck for return address (Bcz it is optional but its field except email is required)
    if (
      sellerDetails?.return_address &&
      Object.entries(sellerDetails.return_address)
        .filter(([key]) => key !== "email")
        .some(([_, value]) => !value)
    ) {
      delete sellerDetails.return_address;
    }

    const seller = await Seller.create({
      ...sellerDetails,
      addr_tag_3pl: sellerDetails?.billing_address?.addr_tag_3pl,
    });

    //  Uploading of KYC Details (if Any)

    const kycFiles = [
      { file: gstFile, keyName: "gst" },
      { file: panFile, keyName: "pan" },
      { file: chequeFile, keyName: "cheque" },
    ];
    const kycDetails = {}; // Store uploaded URLs for DB update

    for (const { file, keyName } of kycFiles) {
      if (file) {
        const { url } = await uploadToS3({
          file,
          key: `${seller._id}/seller-details/${keyName}-${Date.now()}-${
            file.originalname
          }`,
        });
        kycDetails[keyName] = url;
      }
    }

    if (Object.keys(kycDetails).length > 0) {
      await Seller.findByIdAndUpdate(seller._id, {
        $set: { kyc_details: kycDetails },
      });
    }
    if (seller) res.status(200).json({ seller });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { createSeller };
