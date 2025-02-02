import csvtojson from "csvtojson";
import { nanoid } from "nanoid";
import { uploadCsvToS3, uploadToS3 } from "../../../s3/s3.js";
import { json2csv } from "json-2-csv";
import { Catalogue } from "../../../models/catalogue/catalogue.model.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const createCataloguesInBulk = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const csvString = req?.file?.buffer?.toString("utf-8");
    const jsonArray = await csvtojson().fromString(csvString);

    let groupedProducts = {};
    let errors = [];
    let productCodes = [];
    let skuIds = [];

    // Collect product codes and sku_ids
    jsonArray.forEach((item) => {
      productCodes.push(item["Product Code"]?.trim());
      skuIds.push(item["Sku ID"]?.trim());
    });

    // Check for existing product codes and sku_ids in the database
    const existingProductCodes = await Catalogue.aggregate([
      { $match: { product_code: { $in: [...productCodes] } } },
      { $project: { product_code: 1 } },
    ]);

    const existingProductCodesSet = new Set(
      existingProductCodes.map((p) => p.product_code)
    );

    const existingSkuIds = await Catalogue.aggregate([
      { $unwind: "$customer_skus" },
      { $match: { "customer_skus.sku_id": { $in: [...skuIds] } } },
      { $project: { "customer_skus.sku_id": 1 } },
    ]);

    const existingSkuIdsSet = new Set(
      existingSkuIds.map((sku) => sku.customer_skus.sku_id)
    );

    jsonArray.forEach((item, index) => {
      let productCode = item["Product Code"]?.trim();
      let sku_id = item["Sku ID"]?.trim();

      let validationErrors = [];

      if (!productCode) validationErrors.push("Product code is required");
      // Check if the product code already exists in the database
      if (existingProductCodesSet.has(productCode)) {
        validationErrors.push("Try different Product code");
      }

      // Check if the sku_id already exists in the database
      if (existingSkuIdsSet.has(sku_id)) {
        validationErrors.push("Try another Unique SKU ID ");
      }

      // Convert values to correct types
      let costPrice = parseFloat(item["Cost Price"]);
      let sellingPrice = parseFloat(item["Selling Price"]);
      let mrp = parseFloat(item["MRP"]);
      let quantity = parseInt(item["Quantity"]);
      let weight = parseFloat(item["Packaging Weight (in kg)"]);
      let length = parseFloat(item["Packaging Length (in cm)"]);
      let breadth = parseFloat(item["Packaging Breadth (in cm)"]);
      let height = parseFloat(item["Packaging Height (in cm)"]);

      // Field Validations
      if (costPrice >= sellingPrice)
        validationErrors.push("Cost Price should be less than Selling Price");

      if (sellingPrice >= mrp)
        validationErrors.push("Selling Price should be less than MRP");

      if (costPrice < 0 || costPrice > 1000000)
        validationErrors.push("Cost Price out of range (0-1000000)");

      if (sellingPrice < 0 || sellingPrice > 1000000)
        validationErrors.push("Selling Price out of range (0-1000000)");

      if (mrp < 0 || mrp > 1000000)
        validationErrors.push("MRP out of range (0-1000000)");

      if (quantity < 0 || quantity > 1000000)
        validationErrors.push("Quantity out of range (0-1000000)");

      // Weight Validation
      if (weight < 0.05 || weight > 30)
        validationErrors.push("Weight should be between 0.05 and 30 kg");

      // Dimension Validation
      if (length < 1 || length > 200)
        validationErrors.push("Length should be between 1 and 200 cm");

      if (breadth < 1 || breadth > 200)
        validationErrors.push("Breadth should be between 1 and 200 cm");

      if (height < 1 || height > 200)
        validationErrors.push("Height should be between 1 and 200 cm");

      // SKU Required Field Validations
      if (!item["Size"].trim()) {
        validationErrors.push("Size is required");
      }
      if (!sku_id) {
        validationErrors.push("SKU ID is required");
      }

      // If there are validation errors, add them to the errors array
      if (validationErrors.length > 0) {
        item["error_message"] = validationErrors.join(", ");
        errors.push({ row: index + 1, errors: validationErrors });
      } else {
        item["error_message"] = ""; // Ensure the column exists in all rows
      }

      // Format SKU Data
      let skuData = {
        size: item["Size"].trim(),
        short_id: generateShortId(8),
        sku_id: sku_id,
        length,
        breadth,
        height,
        cost_price: costPrice,
        selling_price: sellingPrice,
        mrp: mrp,
        quantity: quantity,
        weight: weight,
        volume: Math.ceil(((height * length * breadth) / 5000) * 2) / 2,
      };

      const is_product_visible =
        item["Visibility"].trim().toUpperCase() === "TRUE";

      if (!groupedProducts[productCode]) {
        groupedProducts[productCode] = {
          product_code: productCode,
          product_short_id: generateShortId(8),
          title: item["Name"].trim() || null,
          description: item["Description"].trim() || null,
          product_type: item["Product Type"].trim() || null,
          color: item["Color"].trim() || null,
          size_type: item["Size Type"].trim() || null,
          pickup_point: item["Pickup Point"].trim() || null,
          return_condition: item["Return/Exchange Condition"].trim() || null,
          collections_to_add: [
            item["Collection _1"],
            item["Collection_2"],
            item["Collection_3"],
          ].filter(Boolean),
          media: {
            images: [
              item["Image 1"],
              item["Image 2"],
              item["Image 3"],
              item["Image 4"],
              item["Image 5"],
            ]
              .filter(Boolean)
              .map((url, index) => ({ url, index })),
            videos: [item["Video 1"], item["Video 2"]]
              .filter(Boolean)
              .map((url, index) => ({ url, index })),
          },
          product_attributes: Object.keys(item)
            .filter((key) => key.startsWith("attr"))
            .map((key) => {
              return {
                key: key.split("_")[1] || key, // Extracting key after 'attrX_'
                value: item[key].trim(),
              };
            })
            .filter((attr) => attr.value),
          customer_skus: [skuData],
          is_visible: is_product_visible,
          seller: req.seller._id,
        };
      } else {
        // Update catalogue-level fields with values from the current row if they exist
        groupedProducts[productCode].title =
          groupedProducts[productCode].title || item["Name"].trim();
        groupedProducts[productCode].description =
          groupedProducts[productCode].description ||
          item["Description"].trim();
        groupedProducts[productCode].product_type =
          groupedProducts[productCode].product_type ||
          item["Product Type"].trim();
        groupedProducts[productCode].color =
          groupedProducts[productCode].color || item["Color"].trim();
        groupedProducts[productCode].size_type =
          groupedProducts[productCode].size_type || item["Size Type"].trim();
        groupedProducts[productCode].pickup_point =
          groupedProducts[productCode].pickup_point ||
          item["Pickup Point"].trim();
        groupedProducts[productCode].return_condition =
          groupedProducts[productCode].return_condition ||
          item["Return/Exchange Condition"].trim();
        groupedProducts[productCode].is_visible =
          groupedProducts[productCode].is_visible || is_product_visible;

        groupedProducts[productCode].customer_skus.push(skuData);
      }
    });

    if (errors.length > 0) {
      const errorCsv = json2csv(jsonArray);
      const originalFileName = req.file.originalname?.split(".")?.[0];
      const errorKey = `${
        req.seller._id
      }/reports/${originalFileName}_error_${nanoid(10)}.csv`;

      const { url } = await uploadCsvToS3({
        file: errorCsv,
        key: errorKey,
      });

      return res.status(400).json({
        message: "Validation errors found",
        errors,
        fileUrl: url,
      });
    }

    const productsToInsert = Object.values(groupedProducts);
    await Catalogue.insertMany(productsToInsert);

    let productsForSuccessCsv = Object.values(groupedProducts).map(
      (product) => ({
        "Product Code": product.product_code || "Unknown",
        Remarks: "SUCCESS",
      })
    );

    const successCsv = json2csv(productsForSuccessCsv);
    const originalFileName = req.file.originalname.split(".")[0];
    const successKey = `${
      req.seller._id
    }/reports/${originalFileName}_success_${nanoid(10)}.csv`;

    const { url } = await uploadCsvToS3({
      file: successCsv,
      key: successKey,
    });

    return res.status(200).json({
      message: "CSV processed successfully",
      data: groupedProducts,
      fileUrl: url,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export { createCataloguesInBulk };
