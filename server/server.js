require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import Routes
const authRouter = require("./routes/authRoutes/authRoutes");
const adminProductsRouter = require("./routes/admin/productsRoutes");
const shopProductsRouter = require("./routes/Shop/productRoutes");
const shopcartRouter = require("./routes/Shop/cartRoutes");
const shopAddressRouter = require("./routes/Shop/addressRoutes");
const shopOrderRouter = require("./routes/Shop/orderRoutes");
const paypalRouter = require("./routes/Shop/paypalRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit process on failure
  });

// ✅ CORS Middleware
const allowedOrigins = [
  "http://localhost:5173", // Local Development
  "https://e-commercebypraveen.onrender.com", // Deployed Frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Pragma",
    "Expires",
],
    credentials: true, // Allow cookies and authentication headers
  })
);

// ✅ Handle Preflight Requests for All Routes
app.options("*", cors());

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Debugging Incoming Requests
app.use((req, res, next) => {
  console.log(`📌 Incoming Request: ${req.method} ${req.url}`);
  console.log("📌 Origin:", req.headers.origin);
  next();
});

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopcartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/orders", shopOrderRouter);
app.use("/api/shop/paypal", paypalRouter);

// ✅ Default Route
app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Ensure it works for all origins
  res.send("<h1>🚀 Server is Running!</h1>");
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ✅ Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server Running on http://localhost:${PORT}`)
);
