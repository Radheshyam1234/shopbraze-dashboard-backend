import { WebsiteNavigationMenu } from "../../../models/website-navigation-menu/website-navigation-menu.js";
import { generateShortId } from "../../../utils/generate-short-id.js";

const createNavigationMenuItem = async (req, res) => {
  try {
    const { data } = req?.body;

    let parentNavigationToAdd = null;

    if (data?.parent_short_id !== null) {
      parentNavigationToAdd = await WebsiteNavigationMenu.findOne({
        short_id: data?.parent_short_id,
      });
      if (!parentNavigationToAdd)
        return res.status(404).json({ error: "Invalid data" });
    }

    const createdNavigationItem = await WebsiteNavigationMenu.create({
      short_id: generateShortId(12),
      title: data?.title,
      link: data?.link,
      parent_short_id: data?.parent_short_id,
      seller: req?.seller?._id,
    });

    if (parentNavigationToAdd) {
      await WebsiteNavigationMenu?.findOneAndUpdate(
        { short_id: parentNavigationToAdd?.short_id },
        {
          $push: { children: createdNavigationItem },
        }
      );
    }

    res.status(200).json({ message: " Navigation created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { createNavigationMenuItem };
