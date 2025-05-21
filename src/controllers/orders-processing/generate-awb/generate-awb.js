import axios from "axios";
import { Order } from "../../../models/order/order.model.js";

const generateAWB = async (req, res) => {
  try {
    const { order_id, courier_id } = req?.body;

    const orderData = await Order.findOne({ order_id });

    if (!orderData || !orderData?.shiprocket_shipment_id)
      return res
        .status(422)
        .json({ error: "No order or order confirmation found" });

    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
        {
          shipment_id: orderData?.shiprocket_shipment_id,
          courier_id,
        },
        {
          headers: {
            Authorization: `Bearer ${req?.seller?.shiprocket_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { awb_code, courier_name } = response?.data?.response?.data;

      console.log(response?.data?.response?.data);

      if (awb_code) {
        orderData?.products.forEach((product) => {
          const history = product?.status_history;
          const lastStatus = history?.[history.length - 1]?.status;

          if (lastStatus === "pending") {
            product.status_history.push({
              status: "ready to ship",
              date: new Date(),
            });
          }
        });

        orderData.shiprocket_shipment_awb_code = awb_code;
        orderData.shiprocket_shipping_courier_name = courier_name;

        await orderData.save();

        return res
          .status(200)
          .json({ message: "Order confirmed successfully." });
      } else return res.status(500).json("Something went wrong");
    } catch (error) {
      console.error(
        "Shiprocket API Error:",
        error?.response?.data || error?.message
      );
      return res.status(500).json("Something went wrong");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { generateAWB };
