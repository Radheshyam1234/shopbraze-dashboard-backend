import { WebsiteNavigationMenu } from "../../../models/website-navigation-menu/website-navigation-menu.js";

const getNavigationMenuItems = async (req, res) => {
  try {
    const navigationData = await WebsiteNavigationMenu.find({
      seller: req?.seller?._id,
      parent_short_id: null,
    })
      .select("-createdAt -updatedAt -seller")
      .populate({
        path: "children",
        select: "-createdAt -updatedAt -seller",
        populate: {
          path: "children",
          select: "-createdAt -updatedAt -seller",
        },
      });
    res.status(200).json({ data: navigationData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { getNavigationMenuItems };
