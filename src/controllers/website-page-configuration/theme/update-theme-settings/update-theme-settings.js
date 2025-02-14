const updateThemeSettings = async (req, res) => {
  try {
    console.log("updating theme settings");
    //  const updatedData = { ...existingCollection.toObject(), ...newData };
    res.status(200).json({ message: " Theme Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export { updateThemeSettings };
