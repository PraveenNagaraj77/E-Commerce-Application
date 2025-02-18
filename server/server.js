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

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit if connection fails
  });

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed Origins
const allowedOrigins = [
  "https://e-commercebypraveen.onrender.com", // Deployed Frontend
  "http://localhost:5173", // Local Development
];

// CORS Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allows sending authentication cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "X-Requested-With", "Accept"],
  })
);

// Trust Proxy for Render Deployment
app.set("trust proxy", 1);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Supports form submissions

// Debug Incoming Requests
app.use((req, res, next) => {
  console.log(`📌 Incoming Request: ${req.method} ${req.url}`);
  console.log("📌 Origin:", req.headers.origin);
  console.log("📌 Headers:", req.headers);
  next();
});

// Test Route
app.get("/", (req, res) => {
  res.send("<h1>🚀 Server is Running!</h1>");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopcartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/orders", shopOrderRouter);
app.use("/api/shop/paypal", paypalRouter);

// Start Server
app.listen(PORT, () => console.log(`🚀 Server Running on http://localhost:${PORT}`));
