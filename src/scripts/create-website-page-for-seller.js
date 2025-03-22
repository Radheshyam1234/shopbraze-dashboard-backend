// node --require dotenv/config src/scripts/create-website-page-for-seller.js

import { connectDB, disconnectDB } from "../configurations/db/index.js";
import { Seller } from "../models/user/seller.model.js";
import { WebsitePage } from "../models/website-page/website-page.model.js";
import { generateShortId } from "../utils/generate-short-id.js";

const createWebsitePageForSeller = async (sellerId, page_type) => {
  try {
    if (
      !sellerId ||
      ![
        "home_page",
        "product_page",
        "order_status_page",
        "featured_page",
      ].includes(page_type)
    ) {
      console.log("Invalid Request");
      return { error: "Invalid Request" };
    }

    await connectDB();

    const isValidSeller = await Seller.findById(sellerId);
    if (!isValidSeller) {
      console.log("Seller does not exist");
      return { error: "Seller does not exist" };
    }

    const isPageExists = await WebsitePage.findOne({
      type: page_type,
      seller: sellerId,
    });
    if (isPageExists) {
      console.log("Page already exists");
      return { error: "Page already exists" };
    }

    const pageData = {
      type: page_type,
      is_active: true,
      is_visible: true,
      template_short_ids: [],
      short_id: generateShortId(10),
      seller: sellerId,
    };

    const createdPage = await WebsitePage.create(pageData);

    console.log("Page Created Successfully");
    return { message: "Page Created Successfully", data: createdPage };
  } catch (error) {
    console.log("Error creating website page:", error);
    return { error: error.message };
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

createWebsitePageForSeller("67985a83c0d392e80ef08513", "product_page");
