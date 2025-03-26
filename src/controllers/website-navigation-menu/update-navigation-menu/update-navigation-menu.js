import { WebsiteNavigationMenu } from "../../../models/website-navigation-menu/website-navigation-menu.js";

const insertNavigationRecursive = async (data, seller, parentId = null) => {
  const { children = [], ...itemData } = data;

  // Insert the parent first
  const newItem = await WebsiteNavigationMenu.create({
    ...itemData,
    seller,
    parent: parentId, // Store parent reference
    children: [], // Initialize empty children array
  });

  // Collect children ObjectIds
  const childIds = [];

  for (const child of children) {
    const childItem = await insertNavigationRecursive(
      child,
      seller,
      newItem._id
    );
    childIds.push(childItem._id);
  }

  // Update parent with ordered children IDs after all children are inserted
  if (childIds.length > 0) {
    await WebsiteNavigationMenu.findByIdAndUpdate(newItem._id, {
      $set: { children: childIds }, // Set ordered children
    });
  }

  return newItem;
};

const updateNavigationMenuItems = async (req, res) => {
  try {
    const { data } = req?.body;
    await WebsiteNavigationMenu.deleteMany({ seller: req?.seller?._id });

    for (const item of data) {
      await insertNavigationRecursive(item, req?.seller?._id, null);
    }

    res.status(200).json({ message: "Navigations updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const updateNavigationMenuItemById = async (req, res) => {
  try {
    const { navigationMenuId } = req?.params;
    const { title, link } = req?.body;

    const navItem = await WebsiteNavigationMenu.findOne({
      short_id: navigationMenuId,
    });
    if (!navItem)
      return res.status(404).json({ error: "Navigation not found" });

    await WebsiteNavigationMenu.findOneAndUpdate(
      { short_id: navigationMenuId },
      { title, link }
    );
    res.status(200).json({ message: " Visibility updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

const changeNavigationMenuItemVisibility = async (req, res) => {
  try {
    const { navigationMenuId } = req?.params;
    const { visibility } = req?.body;

    const navItem = await WebsiteNavigationMenu.findOne({
      short_id: navigationMenuId,
    });
    if (!navItem)
      return res.status(404).json({ error: "Navigation not found" });

    await WebsiteNavigationMenu.findOneAndUpdate(
      { short_id: navigationMenuId },
      { is_visible: visibility }
    );
    res.status(200).json({ message: " Visibility updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export {
  updateNavigationMenuItems,
  changeNavigationMenuItemVisibility,
  updateNavigationMenuItemById,
};
