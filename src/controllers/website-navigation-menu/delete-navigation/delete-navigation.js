import { WebsiteNavigationMenu } from "../../../models/website-navigation-menu/website-navigation-menu.js";

const deleteNavigationMenuItem = async (req, res) => {
  try {
    const { navigationMenuId } = req?.params;

    const navItem = await WebsiteNavigationMenu.findOne({
      short_id: navigationMenuId,
    });

    if (!navItem)
      return res.status(404).json({ error: "Navigation item not found" });

    await WebsiteNavigationMenu.updateMany(
      { children: navItem._id },
      { $pull: { children: navItem._id } }
    );

    await WebsiteNavigationMenu.deleteOne({ short_id: navigationMenuId });

    res.status(200).json({ message: "Navigation item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { deleteNavigationMenuItem };
