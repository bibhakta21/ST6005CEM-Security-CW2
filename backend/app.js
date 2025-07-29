// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDb = require("./config/db");


// Import routes
const userRoutes = require("./routes/userRoutes");
const ProductRoutes = require("./routes/ProductRoute");
const bookingRoutes = require("./routes/BookingRoute");
const contactRoutes = require("./routes/contactRoute");
const dashboardRoutes = require("./routes/dashboardRoutes.JS");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const logActivity = require("./middleware/activityLogger");



const app = express();

//  Connect to the database
connectDb();

//Allow CORS only for frontend & credentials
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

//Middleware 
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));


// CORS issue with Static File Serving
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  }
}));




app.use("/api/users", userRoutes);

app.use(logActivity);
app.use("/api/products", ProductRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes); 
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/dashboard", dashboardRoutes);



app.get("/", (req, res) => {
  res.send("Welcome to the Venue Booking API!");
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app; 
