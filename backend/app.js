require("dotenv").config();
const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Routes
const userRoutes = require("./routes/userRoutes");
const ProductRoutes = require("./routes/ProductRoute");
const bookingRoutes = require("./routes/BookingRoute");
const contactRoutes = require("./routes/contactRoute");
const dashboardRoutes = require("./routes/dashboardRoutes.JS");
const bookmarkRoutes = require("./routes/bookmarkRoutes");

// Middleware
const logActivity = require("./middleware/activityLogger");

const app = express();

// Disable Express fingerprint
app.disable("x-powered-by");

// Connect to MongoDB
connectDb();


//Secure Session Setup

app.use(session({
  name: "sessionId",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 30 * 24 * 60 * 60, // 30 days
  }),
  cookie: {
    httpOnly: true,
    secure: false, // Set to true in production (HTTPS)
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
}));



//  Helmet HTTP Headers

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://www.google.com", "https://www.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "http://localhost:3000"],
    },
  })
);
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));


//CORS Config

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));


// Rate Limiting (Login/Register)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many attempts from this IP, please try again after 15 minutes.",
});
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);


// Middlewares

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

// HPP (HTTP Parameter Pollution) Protection
const hppWhitelist = ["tags", "colors", "sizes", "filters", "sortBy"];
app.use(hpp({
  whitelist: hppWhitelist,
  checkQuery: true,
  checkBody: true,
  checkBodyOnlyForContentType: ["urlencoded", "json"],
}));
app.use((req, res, next) => {
  const polluted = Object.entries(req.query).filter(
    ([key, value]) => Array.isArray(value) && !hppWhitelist.includes(key)
  );
  if (polluted.length > 0) {
    console.warn("[HPP Detected] Polluted Params:", polluted);
  }
  next();
});

// Logger
app.use(morgan("dev"));

// Static File Serving (e.g., avatar uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  },
}));


// CSRF Protection

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: "Strict",
    secure: false,
  },
});
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


//  Routes

app.use("/api/users", userRoutes);
app.use(logActivity); // Log actions after auth routes
app.use("/api/products", ProductRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/dashboard", dashboardRoutes);


//  Health Check

app.get("/", (req, res) => {
  res.send("Welcome to the nepalwears!");
});


//  Global Error Handler

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File size should not exceed 2MB" });
  }
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
