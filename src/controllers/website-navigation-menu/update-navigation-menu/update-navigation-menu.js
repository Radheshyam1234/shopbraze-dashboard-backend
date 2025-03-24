const updateNavigationMenu = async (req, res) => {
  try {
    const { data } = req?.body;
    console.log(data);
    res.status(200).json({ message: " Navigation created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { updateNavigationMenu };
