import { WebsitePage } from "../../../models/website-page/website-page.model.js";

const getHomePageInfo = async (req, res) => {
  try {
    const pageData = await WebsitePage.findOne({ type: "home_page" });
    res.status(200).json({ data: pageData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { getHomePageInfo };
