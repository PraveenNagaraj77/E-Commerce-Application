
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

    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    if (!validMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only JPG, PNG, and GIF images are allowed.",
      });
    }

    const base64 = Buffer.from(req.file.buffer).toString("base64");
    const imageUrl = `data:${req.file.mimetype};base64,${base64}`;

    const result = await ImageUploadUtils(imageUrl);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Image Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Image upload failed.",
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    if (!image || !title?.trim() || !description?.trim() ||
        !category || !brand || price === undefined ||
        totalStock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields.",
      });
    }

    const parsedPrice = Number(price);
    const parsedSalePrice = Number(salePrice ?? 0);
    const parsedStock = Number(totalStock);

    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0 ||
      !Number.isFinite(parsedSalePrice) ||
      parsedSalePrice < 0 ||
      !Number.isInteger(parsedStock) ||
      parsedStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid price, sale price, and stock values.",
      });
    }

    if (parsedSalePrice > 0 && parsedSalePrice >= parsedPrice) {
      return res.status(400).json({
        success: false,
        message: "Sale price must be lower than the regular price.",
      });
    }

    const newlyCreatedProduct = new Product({
      image,
      title: title.trim(),
      description: description.trim(),
      category,
      brand,
      price: parsedPrice,
      salePrice: parsedSalePrice,
      totalStock: parsedStock,
    });

    await newlyCreatedProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product Added",
      data: newlyCreatedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);

    return res.status(500).json({
      success: false,
      message: "Error adding product.",
    });
  }
};

const fetchAllProduct = async (req, res) => {
  try {
    const listOfProducts = await Product.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching products.",
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    if (price !== undefined) {
      const parsedPrice = Number(price);

      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid product price.",
        });
      }

      product.price = parsedPrice;
    }

    if (salePrice !== undefined) {
      const parsedSalePrice = Number(salePrice);

      if (!Number.isFinite(parsedSalePrice) || parsedSalePrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid sale price.",
        });
      }

      product.salePrice = parsedSalePrice;
    }

    if (totalStock !== undefined) {
      const parsedStock = Number(totalStock);

      if (!Number.isInteger(parsedStock) || parsedStock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative whole number.",
        });
      }

      product.totalStock = parsedStock;
    }

    if (image !== undefined) product.image = image;
    if (title !== undefined) product.title = title.trim();
    if (description !== undefined) product.description = description.trim();
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;

    if (product.salePrice > 0 && product.salePrice >= product.price) {
      return res.status(400).json({
        success: false,
        message: "Sale price must be lower than the regular price.",
      });
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product Updated",
      data: product,
    });
  } catch (error) {
    console.error("Error editing product:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating product.",
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
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting product.",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProduct,
  editProduct,
  deleteProduct,
};
