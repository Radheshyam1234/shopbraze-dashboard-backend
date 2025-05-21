import axios from "axios";

const generateLabel = async (req, res) => {
  try {
    const { shipment_ids } = req?.body;
    if (!shipment_ids || shipment_ids?.length === 0)
      return res.status(404).json({ error: "Shipment Id is required" });
    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/courier/generate/label",
        {
          shipment_id: shipment_ids,
        },
        {
          headers: {
            Authorization: `Bearer ${req?.seller?.shiprocket_token}`,
          },
        }
      );
      if (response?.data?.label_url)
        return res.status(200).json({ label_url: response?.data?.label_url });
      return res.status(500).json({ error: "Something went wrong" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const generateInvoice = async (req, res) => {
  try {
    const { order_ids } = req?.body;
    if (!order_ids || order_ids?.length === 0)
      return res.status(404).json({ error: "Order Id is required" });
    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/print/invoice",
        {
          ids: order_ids,
        },
        {
          headers: {
            Authorization: `Bearer ${req?.seller?.shiprocket_token}`,
          },
        }
      );
      if (response?.data?.invoice_url)
        return res
          .status(200)
          .json({ invoice_url: response?.data?.invoice_url });
      return res.status(500).json({ error: "Something went wrong" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { generateLabel, generateInvoice };
