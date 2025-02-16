import cors from "cors";

const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      /shopbraze/.test(origin) ||
      /^http:\/\/localhost:\d+$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});

export { corsMiddleware };
