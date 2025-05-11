import axios from "axios";

const getCourierServiceability = async (req, res) => {
  try {
    const { pickup_postcode, delivery_postcode, cod, weight } = req.query;

    if (!pickup_postcode || !delivery_postcode || !weight)
      return res.status(404).json({ error: "Some fileds are missing" });

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjY1NjUxOTMsInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzQ3NzUyMDcyLCJqdGkiOiJXOWtVZUcxSlR1TkVHV2pqIiwiaWF0IjoxNzQ2ODg4MDcyLCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTc0Njg4ODA3MiwiY2lkIjo1MjY4MDgzLCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.e0nS03Oqsroxaqi8PJcebr9qtENxj6FC6NsNJNM9LuM";

    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability`,
      {
        params: {
          pickup_postcode,
          delivery_postcode,
          cod,
          weight,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const available_courier_companies =
      response?.data?.data?.available_courier_companies;
    const shiprocket_recommended_courier_id =
      response?.data?.data?.shiprocket_recommended_courier_id;

    res
      .status(200)
      .json({ available_courier_companies, shiprocket_recommended_courier_id });
  } catch (error) {
    console.error("Shiprocket API Error:", error?.response?.data || error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
};

export { getCourierServiceability };
