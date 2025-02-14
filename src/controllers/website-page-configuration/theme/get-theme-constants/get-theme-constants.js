import { FontData } from "../../../../constants/fonts.js";
import { AvailableThemes } from "../../../../constants/theme-constants.js";

const getThemeConstants = async (req, res) => {
  try {
    const available_themes = AvailableThemes;
    const font_data = FontData;
    res.status(200).json({ data: { available_themes, font_data } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export { getThemeConstants };
