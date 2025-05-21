import axios from "axios";
import { Order } from "../../../models/order/order.model.js";

const cancelShipment = async (req, res) => {
  try {
    const { awb_codes } = req?.body;

    if (!Array.isArray(awb_codes) || awb_codes?.length === 0) {
      return res
        .status(400)
        .json({ error: "awb_codes must be a non-empty array" });
    }

    const ordersData = await Order.find({
      shiprocket_shipment_awb_code: { $in: awb_codes },
    });

    if (ordersData?.length !== awb_codes?.length)
      return res
        .status(404)
        .json({ error: "Some AWB codes were not found in orders" });

    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/cancel/shipment/awbs",
        {
          awbs: awb_codes,
        },
        {
          headers: {
            Authorization: `Bearer ${req?.seller?.shiprocket_token}`,
          },
        }
      );

      const now = new Date();

      const updatePromises = ordersData.map(async (order) => {
        order.shiprocket_shipment_awb_code = "";

        order.products = order.products.map((product) => {
          const history = product?.status_history || [];

          if (
            history?.length > 0 &&
            history?.[history?.length - 1]?.status === "ready to ship"
          ) {
            history.push({
              status: "pending",
              timestamp: now,
            });
          }
          return {
            ...product,
            status_history: history,
          };
        });

        await order.save();
      });
      await Promise.all(updatePromises);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Shiprocket cancel error:", error?.response?.data || error);
      return res
        .status(500)
        .json({ error: "Shiprocket API cancellation failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { order_ids } = req?.body;

    if (!Array.isArray(order_ids) || order_ids?.length === 0) {
      return res
        .status(400)
        .json({ error: "awb_codes must be a non-empty array" });
    }

    const ordersData = await Order.find({
      shiprocket_order_id: { $in: order_ids },
    });

    if (ordersData?.length !== order_ids?.length)
      return res
        .status(404)
        .json({ error: "Some Order Ids were not found in orders" });

    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/cancel",
        {
          ids: order_ids,
        },
        {
          headers: {
            Authorization: `Bearer ${req?.seller?.shiprocket_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const now = new Date();

      const updatePromises = ordersData.map(async (order) => {
        order.products = order.products.map((product) => {
          const history = product?.status_history || [];
          const lastStatus = history?.[history?.length - 1]?.status;

          if (lastStatus === "ready to ship") {
            history.push({
              status: "cancelled",
              timestamp: now,
            });
          }
          return {
            ...product,
            status_history: history,
          };
        });

        await order.save();
      });
      await Promise.all(updatePromises);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Shiprocket cancel error:", error?.response?.data || error);
      return res
        .status(500)
        .json({ error: "Shiprocket API cancellation failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { cancelShipment, cancelOrder };
