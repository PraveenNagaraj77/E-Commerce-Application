const mongoose = require('mongoose');
const Product = require('./models/Product'); // Ensure this path is correct

mongoose.connect('mongodb+srv://praveennagaraj76:praveenPR76@cluster0.zhyrm.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const products = [
    {
        image: "https://m.media-amazon.com/images/I/719SkSU-PgL._AC_UL320_.jpg",
        title: "Nike Running Shoes",
        description: "Lightweight and comfortable running shoes from Nike.",
        category: "footwear",
        brand: "nike",
        price: 120,
        salePrice: 99,
        totalStock: 50
    },
    {
        image: "https://m.media-amazon.com/images/I/717u4dOO0pL._AC_UL320_.jpg",
        title: "Adidas Sports Jacket",
        description: "High-quality Adidas sports jacket for men.",
        category: "men",
        brand: "adidas",
        price: 80,
        salePrice: 65,
        totalStock: 30
    },
    {
        image: "https://m.media-amazon.com/images/I/51BxhiVoo6L._SY695_.jpg",
        title: "Puma Casual Sneakers",
        description: "Stylish and durable sneakers from Puma.",
        category: "footwear",
        brand: "puma",
        price: 90,
        salePrice: 75,
        totalStock: 40
    },
    {
        image: "https://m.media-amazon.com/images/I/41x507Qk7oL._SX300_SY300_QL70_FMwebp_.jpg",
        title: "Samsung Galaxy S23",
        description: "Latest Samsung smartphone with AMOLED display.",
        category: "accessories",
        brand: "samsung",
        price: 999,
        salePrice: 899,
        totalStock: 20
    },
    {
        image: "https://m.media-amazon.com/images/I/61oCISLE+PL._AC_UY218_.jpg",
        title: "Apple AirPods Pro",
        description: "Active noise cancellation wireless earbuds from Apple.",
        category: "accessories",
        brand: "apple",
        price: 249,
        salePrice: 199,
        totalStock: 35
    },
    {
        image: "https://m.media-amazon.com/images/I/51aXvjzcukL._AC_UY218_.jpg",
        title: "Sony Bluetooth Headphones",
        description: "Premium sound quality Bluetooth headphones from Sony.",
        category: "accessories",
        brand: "sony",
        price: 300,
        salePrice: 250,
        totalStock: 25
    },
    {
        image: "https://m.media-amazon.com/images/I/51zvI1uJCPL._AC_UL320_.jpg",
        title: "Nike Sports T-Shirt",
        description: "Breathable and comfortable sports t-shirt for men.",
        category: "men",
        brand: "nike",
        price: 35,
        salePrice: 30,
        totalStock: 60
    },
    {
        image: "https://m.media-amazon.com/images/I/81cGRbdZoyL._AC_UL320_.jpg",
        title: "Adidas Training Shoes",
        description: "High-performance training shoes for all sports.",
        category: "footwear",
        brand: "adidas",
        price: 110,
        salePrice: 90,
        totalStock: 45
    },
    {
        image: "https://m.media-amazon.com/images/I/51vP3QtbovL._AC_UL320_.jpg",
        title: "Kids Puma Sneakers",
        description: "Comfortable and stylish sneakers for kids.",
        category: "kids",
        brand: "puma",
        price: 60,
        salePrice: 50,
        totalStock: 35
    },
    {
        image: "https://m.media-amazon.com/images/I/61opqQEBUxL._AC_UY218_.jpg",
        title: "Apple MacBook Pro 16",
        description: "Latest MacBook Pro with M2 chip and retina display.",
        category: "accessories",
        brand: "apple",
        price: 2499,
        salePrice: 2399,
        totalStock: 10
    },
    {
        image: "https://m.media-amazon.com/images/I/51ljnEaW0pL._AC_UY218_.jpg",
        title: "Sony PlayStation 5",
        description: "Next-generation gaming console with ultra-high speed SSD.",
        category: "accessories",
        brand: "sony",
        price: 499,
        salePrice: 450,
        totalStock: 15
    },
    {
        image: "https://m.media-amazon.com/images/I/71JZiGISnAL._AC_UY218_.jpg",
        title: "Mens Smartwatch",
        description: "Fitness tracking and notifications on your wrist.",
        category: "accessories",
        brand: "samsung",
        price: 299,
        salePrice: 249,
        totalStock: 25
    },
    {
        image: "https://m.media-amazon.com/images/I/81XBGJZISWL._AC_UL320_.jpg",
        title: "Womens Running Shoes",
        description: "Comfortable and stylish running shoes for women.",
        category: "women",
        brand: "nike",
        price: 130,
        salePrice: 110,
        totalStock: 50
    },
    {
        image: "https://m.media-amazon.com/images/I/71JQ3kUrR9L._AC_UY218_.jpg",
        title: "Samsung Smart TV",
        description: "Crystal clear 4K smart TV with HDR support.",
        category: "accessories",
        brand: "samsung",
        price: 799,
        salePrice: 699,
        totalStock: 20
    },
    {
        image: "https://m.media-amazon.com/images/I/61sBqyReYkL._AC_UL320_.jpg",
        title: "Nike Football Shoes",
        description: "High-traction football shoes for professional players.",
        category: "footwear",
        brand: "nike",
        price: 150,
        salePrice: 130,
        totalStock: 35
    },
    {
        image: "https://m.media-amazon.com/images/I/81bo5BwFbWL._AC_UL320_.jpg",
        title: "Adidas Basketball Shoes",
        description: "Durable and comfortable basketball shoes.",
        category: "footwear",
        brand: "adidas",
        price: 180,
        salePrice: 160,
        totalStock: 40
    }
];

Product.insertMany(products)
    .then(() => {
        console.log("Products inserted successfully!");
        mongoose.connection.close();
    })
    .catch(err => {
        console.error("Error inserting products:", err);
        mongoose.connection.close();
    });
