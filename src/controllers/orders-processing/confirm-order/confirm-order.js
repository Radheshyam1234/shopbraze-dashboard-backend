import axios from "axios";
import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { Order } from "../../../models/order/order.model.js";
import { generateNumericId } from "../../../utils/generate-random-numbers.js";

const confirmOrder = async (req, res) => {
  try {
    const { order_id } = req?.body;

    if (!order_id) {
      return res.status(400).json({ error: "Order ID is required." });
    }

    const orderData = await Order.findOne({ order_id });

    if (!orderData) {
      return res.status(404).json({ error: "Order not found." });
    }

    const orderProductsSkuIdsWithQuantity = orderData?.products
      ?.filter(
        (item) =>
          item?.status_history?.[item?.status_history?.length - 1]?.status ===
          "pending"
      )
      ?.map((item) => ({
        sku_id: item?.customer_sku_short_id,
        quantity: item?.quantity_to_buy,
      }));

    if (orderProductsSkuIdsWithQuantity?.length > 0) {
      try {
        const orderProductsAllSkusData = await getSkuDetailsMap(
          orderProductsSkuIdsWithQuantity
        );
        const weight = calculateOrderTotalDeadWeight(orderProductsAllSkusData);
        const { length, breadth, height } = calculateFinalDimensions(
          orderProductsAllSkusData
        );
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjY1NjUxOTMsInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzQ4NTI5ODI4LCJqdGkiOiJqR25tUGJQdDh5bHdBU2ZvIiwiaWF0IjoxNzQ3NjY1ODI4LCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTc0NzY2NTgyOCwiY2lkIjo1MjY4MDgzLCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.YqmM3QBVkWIWA6dMEyxqD43C-MlhZBTr2wSwy0WOeLA";

        const payload = {
          order_id: orderData?.order_id,
          order_date: orderData?.createdAt,
          // pickup_location:
          //   "Gali No 1 DhoopSingh Nagar Panipat, DhoopSingh Nagar, Panipat, Haryana, India, 132103",

          billing_customer_name: orderData?.customer_details?.name,
          billing_last_name: orderData?.customer_details?.name
            ?.split(" ")
            ?.pop(),
          billing_address:
            orderData?.customer_details?.address?.building_name ??
            "" + orderData?.customer_details?.address?.area_name ??
            "",
          billing_city: orderData?.customer_details?.address?.city,
          billing_pincode: orderData?.customer_details?.address?.pincode,
          billing_state: orderData?.customer_details?.address?.state,
          billing_country: "India",
          billing_email: "noreply@shiprocket.com",
          billing_phone: orderData?.customer_details?.phone,
          shipping_is_billing: true,

          order_items: orderData?.products
            ?.filter(
              (item) =>
                item?.status_history?.[item?.status_history?.length - 1]
                  ?.status === "pending"
            )
            ?.map((item) => {
              return {
                name: item?.product_name,
                sku: item?.customer_sku_short_id,
                units: item?.quantity_to_buy,
                selling_price: item?.effective_price,
                discount: 0,
              };
            }),
          payment_method:
            orderData?.payment_mode === "online" ? "Prepaid" : "COD",
          shipping_charges: 0,
          transaction_charges: 0,
          total_discount: orderData?.bill_details?.coupon_discount,
          sub_total:
            Number(orderData?.bill_details?.total_amount) +
            Number(orderData?.bill_details?.coupon_discount),
          length: length,
          breadth: breadth,
          height: height,
          weight: weight,
        };

        const response = await axios.post(
          "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const { order_id: shiprocket_order_id, shipment_id } = response?.data;

        await Order.findOneAndUpdate(
          { order_id },
          {
            $set: {
              order_confirmation: true,
              shiprocket_order_id: shiprocket_order_id,
              shiprocket_shipment_id: shipment_id,
            },
          },
          { new: true }
        );
        return res
          .status(200)
          .json({ message: "Order confirmed successfully." });
      } catch (error) {
        console.error(
          "Shiprocket API Error:",
          error?.response?.data || error?.message
        );
        return res.status(500).json("Something went wrong");
      }
    }
    res.status(500).json({ error: "No Product Found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const getSkuDetailsMap = async (skuItems) => {
  if (!Array.isArray(skuItems) || skuItems.length === 0) {
    throw new Error("skuItems must be a non-empty array");
  }

  const skuShortIds = skuItems.map((item) => item.sku_id);
  const skuQuantityMap = skuItems.reduce((acc, item) => {
    acc[item.sku_id] = item.quantity;
    return acc;
  }, {});

  const catalogues = await Catalogue.find(
    { "customer_skus.short_id": { $in: skuShortIds } },
    { customer_skus: 1 }
  );

  const skuMap = {};

  for (const catalogue of catalogues) {
    for (const sku of catalogue.customer_skus) {
      if (skuShortIds.includes(sku.short_id)) {
        skuMap[sku.short_id] = {
          length: sku.length,
          breadth: sku.breadth,
          height: sku.height,
          weight: sku.weight,
          quantity: skuQuantityMap[sku.short_id] || 1, // default to 1 if missing
        };
      }
    }
  }

  return skuMap;
};

const calculateOrderTotalDeadWeight = (skuMappedData) => {
  return Object.values(skuMappedData)?.reduce(
    (accWt, item) => accWt + Number(item?.weight) * Number(item?.quantity),
    0
  );
};

const calculateFinalDimensions = (skuMapped) => {
  let maxLength = 0;
  let maxBreadth = 0;
  let totalHeight = 0;

  for (const skuKey in skuMapped) {
    const { length, breadth, height, quantity } = skuMapped[skuKey];

    maxLength = Math.max(maxLength, length);
    maxBreadth = Math.max(maxBreadth, breadth);
    totalHeight += height * quantity;
  }

  return {
    length: maxLength,
    breadth: maxBreadth,
    height: totalHeight,
  };
};

export { confirmOrder };
