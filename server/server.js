const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/authRoutes/authRoutes')
const adminProductsRouter = require('./routes/admin/productsRoutes')
const shopProductsRouter = require('./routes/Shop/productRoutes')
const shopcartRouter = require('./routes/Shop/cartRoutes')
const shopAddressRouter = require('./routes/Shop/addressRoutes')
const shopOrderRouter = require("./routes/Shop/orderRoutes");
const paypalRouter = require("./routes/Shop/paypalRoutes")

//Create Database

mongoose.connect('mongodb+srv://praveennagaraj76:praveenPR76@cluster0.zhyrm.mongodb.net/').then(() => console.log("MongoDB Connected")).catch((error) => console.log(error));

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: [
            'http://localhost:5173',             // Local development
            'https://ecommerce-shopbypraveen.onrender.com'  // Deployed frontend
        ],
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: [
            "Content-Type",
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials: true
    })
);
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter)
app.use('/api/admin/products',adminProductsRouter)
app.use('/api/shop/products',shopProductsRouter)
app.use('/api/shop/cart',shopcartRouter)
app.use('/api/shop/address',shopAddressRouter),
app.use("/api/shop/orders", shopOrderRouter);
app.use("/api/shop/paypal",paypalRouter)



app.listen(PORT,()=>console.log(`Server is now Running on https://localhost:${PORT}`));
