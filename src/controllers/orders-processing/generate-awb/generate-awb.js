const generateAWB = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export { generateAWB };
