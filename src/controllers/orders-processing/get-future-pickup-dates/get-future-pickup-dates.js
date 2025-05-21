import axios from "axios";

const getFuturePickupDates = async (req, res) => {
  try {
    const { awb_code } = req?.query;
    if (!awb_code) return res.status(404).json({ error: "AWB is not valid" });
    try {
      const response = await axios.get(
        `https://apiv2.shiprocket.in/v1/external/shipments/future-pickup-dates`,
        {
          params: {
            awb: awb_code,
          },
          headers: {
            Authorization: `Bearer ${req?.seller?.shiprocket_token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { getFuturePickupDates };
