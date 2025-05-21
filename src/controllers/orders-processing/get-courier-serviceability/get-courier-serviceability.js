import axios from "axios";

const getCourierServiceability = async (req, res) => {
  try {
    const {
      pickup_postcode,
      delivery_postcode,
      cod,
      weight,
      declared_value,
      recommended_val,
    } = req.query;

    if (!pickup_postcode || !delivery_postcode || !weight)
      return res.status(404).json({ error: "Some fileds are missing" });

    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability`,
      {
        params: {
          pickup_postcode,
          delivery_postcode,
          cod,
          weight,
          ...(declared_value && { declared_value }),
          ...(recommended_val && { recommended_val }),
        },
        headers: {
          Authorization: `Bearer ${req?.seller?.shiprocket_token}`,
        },
      }
    );

    const currency = await response?.data;
    const {
      available_courier_companies,
      recommended_by,
      shiprocket_recommended_courier_id,
    } = await response?.data?.data;

    res.status(200).json({
      currency,
      recommended_by,
      available_courier_companies,
      shiprocket_recommended_courier_id,
    });
  } catch (error) {
    console.error("Shiprocket API Error:", error?.response?.data || error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
};

export { getCourierServiceability };
