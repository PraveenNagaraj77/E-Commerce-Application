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

// ✅ Allowed Origins (Corrected Frontend URL)
const allowedOrigins = [
  "https://e-commercebypraveen.onrender.com", // ✅ Correct frontend origin
  "http://localhost:5173", // Local Development
];

// ✅ CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    credentials: true, // ✅ Allows Cookies & Authentication Headers
  })
);

// ✅ Trust Proxy (Required for Render Deployment)
app.set("trust proxy", 1);

// ✅ Debug Incoming Requests
app.use((req, res, next) => {
  console.log(`📌 Incoming Request: ${req.method} ${req.url}`);
  console.log("📌 Origin:", req.headers.origin);
  console.log("📌 Headers:", req.headers);
  next();
});

// Middleware
app.use(cookieParser());
app.use(express.json());

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
