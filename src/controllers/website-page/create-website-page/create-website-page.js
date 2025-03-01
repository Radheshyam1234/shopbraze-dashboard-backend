import { WebsitePage } from "../../../models/website-page/website-page.model.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const createWebsitePage = async (req, res) => {
  try {
    const data = req?.body;
    const createdPage = await WebsitePage.create({
      ...data,
      short_id: generateShortId(10),
      // seller:req?.seller?._id
    });

    res
      .status(200)
      .json({ message: "Page Created Successfully", data: createdPage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { createWebsitePage };
