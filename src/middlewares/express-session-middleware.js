import session from "express-session";
import MongoStore from "connect-mongo";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  ttl: 7 * 24 * 60 * 60, // 7 days
});

const sessionMiddleware = session({
  name: "shopbraze_sess",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Prevent auto-saving raw session ID
  // rolling: true,  // bcz it always send setCookie in every request in response header
  store: sessionStore,
  cookie: {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production" ? true : false,
    // sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    secure: true,
    sameSite: "None",
  },
  genid: function () {
    return crypto.randomBytes(64).toString("hex"); // Generate a raw session ID
  },
});

const sessionExpirationRollingMiddleware = (req, res, next) => {
  if (req.session.user) {
    const now = Date.now();
    const sessionExpiry = req.session.cookie.expires?.getTime();

    if (sessionExpiry && sessionExpiry - now < 24 * 60 * 60 * 1000) {
      req.session.touch(); // ✅ Refresh session expiration
    }
  }
  next();
};

export { sessionMiddleware, sessionStore, sessionExpirationRollingMiddleware };
