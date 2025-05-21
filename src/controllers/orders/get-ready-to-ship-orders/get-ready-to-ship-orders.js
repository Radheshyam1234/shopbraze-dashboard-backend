import { Order } from "../../../models/order/order.model.js";

const getReadyToShipOrders = async (req, res) => {
  try {
    const pendingOrders = await Order.aggregate([
      {
        $match: {
          seller: req?.seller?._id,
        },
      },
      // Step 1: Keep only products whose last status is 'pending'
      {
        $project: {
          order_id: 1,
          order_confirmation: 1,
          payment_mode: 1,
          customer_details: 1,
          bill_details: 1,
          createdAt: 1,
          seller: 1,
          shiprocket_shipment_awb_code: 1,
          shiprocket_shipping_courier_name: 1,
          shiprocket_shipment_id: 1,

          products: {
            $filter: {
              input: "$products",
              as: "product",
              cond: {
                $eq: [
                  { $arrayElemAt: ["$$product.status_history.status", -1] },
                  "ready to ship",
                ],
              },
            },
          },
        },
      },
      // Step 2: Keep only orders with at least 1 pending product
      {
        $match: {
          "products.0": { $exists: true },
        },
      },
      // Step 3: Unwind products so we can enrich each
      { $unwind: "$products" },

      // Step 4: Lookup corresponding catalogue using product.product_short_id
      {
        $lookup: {
          from: "catalogues",
          localField: "products.customer_product_short_id",
          foreignField: "product_short_id",
          as: "catalogue",
        },
      },
      { $unwind: "$catalogue" }, // Each product matches 1 catalogue

      // Step 5: Extract correct SKU from customer_skus using sku short_id
      {
        $addFields: {
          matched_sku: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$catalogue.customer_skus",
                  as: "sku",
                  cond: {
                    $eq: ["$$sku.short_id", "$products.customer_sku_short_id"],
                  },
                },
              },
              0,
            ],
          },
          "products.color": "$catalogue.color",
        },
      },

      // Step 6: Merge SKU details into product
      {
        $addFields: {
          "products.sku_details": {
            sku_id: "$matched_sku.sku_id",
            short_id: "$matched_sku.short_id",
            size: "$matched_sku.size",
            length: "$matched_sku.length",
            breadth: "$matched_sku.breadth",
            height: "$matched_sku.height",
            weight: "$matched_sku.weight",
            volume: "$matched_sku.volume",
          },
        },
      },

      {
        $lookup: {
          from: "sellers",
          localField: "seller",
          foreignField: "_id",
          as: "seller_data",
        },
      },
      {
        $unwind: "$seller_data", // This will ensure that the seller data is unwound properly (each order will have the first matched seller)
      },

      {
        $addFields: {
          pickup_address: {
            $ifNull: [
              { $arrayElemAt: ["$seller_data.pickup_address", 0] },
              "No Pickup Address",
            ],
          },
        },
      },

      // Step 7: Group back to orders and rebuild products array
      {
        $group: {
          _id: "$_id",
          order_id: { $first: "$order_id" },
          order_confirmation: { $first: "$order_confirmation" },
          payment_mode: { $first: "$payment_mode" },
          customer_details: { $first: "$customer_details" },
          bill_details: { $first: "$bill_details" },
          coupon_details: { $first: "$coupon_details" },
          seller: { $first: "$seller" },
          customer: { $first: "$customer" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          products: { $push: "$products" },
          pickup_address: { $first: "$pickup_address" },
          shiprocket_shipment_awb_code: {
            $first: "$shiprocket_shipment_awb_code",
          },
          shiprocket_shipping_courier_name: {
            $first: "$shiprocket_shipping_courier_name",
          },
          shiprocket_shipment_id: { $first: "$shiprocket_shipment_id" },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          seller: 0,
          customer: 0,
          coupon_details: 0,
          updatedAt: 0,
        },
      },
    ]);

    res.status(200).json({ data: pendingOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message });
  }
};

export { getReadyToShipOrders };
