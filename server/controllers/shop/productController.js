
const Product = require("../../models/Product");

const getFilterProducts = async (req, res) => {
    try {
        const {
            category,
            brand,
            search,
            sortBy = "price-lowtohigh",
        } = req.query;

        const filterQuery = {};

        // Category filter
        if (category && category.trim()) {
            filterQuery.category = {
                $in: category
                    .split(",")
                    .map((item) => item.trim().toLowerCase())
                    .filter(Boolean),
            };
        }

        // Brand filter
        if (brand && brand.trim()) {
            filterQuery.brand = {
                $in: brand
                    .split(",")
                    .map((item) => item.trim().toLowerCase())
                    .filter(Boolean),
            };
        }

        // Search across title, description, brand and category
        if (search && search.trim()) {
            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            const searchRegex = new RegExp(escapedSearch, "i");

            filterQuery.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { brand: searchRegex },
                { category: searchRegex },
            ];
        }

        // Sorting
        let sortQuery = {};

        switch (sortBy) {
            case "price-lowtohigh":
                sortQuery.price = 1;
                break;

            case "price-hightolow":
                sortQuery.price = -1;
                break;

            case "title-atoz":
                sortQuery.title = 1;
                break;

            case "title-ztoa":
                sortQuery.title = -1;
                break;

            default:
                sortQuery.price = 1;
        }

        const products = await Product.find(filterQuery).sort(sortQuery);

        return res.status(200).json({
            success: true,
            data: products,
        });

    } catch (error) {
        console.error("Error fetching products:", error);

        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching products",
        });
    }
};

const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: product,
        });

    } catch (error) {
        console.error("Error fetching product details:", error);

        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching product details",
        });
    }
};

module.exports = {
    getFilterProducts,
    getProductDetails,
};
