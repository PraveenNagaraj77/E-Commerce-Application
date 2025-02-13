const { ImageUploadUtils } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Invalid file type. Only JPG, PNG, and GIF are allowed.",
            });
        }

        // Convert file buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await ImageUploadUtils(url);

        return res.status(200).json({
            success: true,
            result,
        });
    } catch (error) {
        console.error("Image Upload Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error Occurred",
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;

        if (!title || !category || !price) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields (title, category, price)",
            });
        }

        const newlyCreatedProduct = new Product({
            image, title, description, category, brand, price, salePrice, totalStock
        });

        await newlyCreatedProduct.save();

        res.status(201).json({
            success: true,
            message: "Product Added",
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            success: false,
            message: "Error Occurred",
        });
    }
};

const fetchAllProduct = async (req, res) => {
    try {
        const listOfProducts = await Product.find({});
        res.status(200).json({
            success: true,
            data: listOfProducts,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Error Occurred",
        });
    }
};

const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;

        let findProduct = await Product.findById(id);
        if (!findProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        findProduct.title = title || findProduct.title;
        findProduct.image = image || findProduct.image;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price === '' ? 0 : price || findProduct.price;
        findProduct.salePrice = salePrice === '' ? 0 : salePrice  || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;

        await findProduct.save();

        res.status(200).json({
            success: true,
            data: findProduct,
        });
    } catch (error) {
        console.error("Error editing product:", error);
        res.status(500).json({
            success: false,
            message: "Error Occurred",
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not Found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product Deleted",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: "Error Occurred",
        });
    }
};

module.exports = { handleImageUpload, addProduct, fetchAllProduct, editProduct, deleteProduct };
