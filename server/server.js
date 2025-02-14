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
  .connect("mongodb+srv://praveennagaraj76:praveenPR76@cluster0.zhyrm.mongodb.net/")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => console.log("❌ MongoDB Connection Error:", error));

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Apply CORS Middleware Properly
app.use(
  cors({
    origin: "https://ecommerce-shopbypraveen.onrender.com", // ✅ Use exact deployed frontend URL
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true, // ✅ Required for cookies/sessions
  })
);

// ✅ Handle Preflight Requests Properly
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://ecommerce-shopbypraveen.onrender.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cache-Control, Expires, Pragma"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// ✅ Debug Incoming Requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Middleware
app.use(cookieParser());
app.use(express.json());

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
