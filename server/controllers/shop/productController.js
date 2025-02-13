const Product = require('../../models/Product');

const getFilterProducts = async (req, res) => {
    try {
        let { category, brand, sortBy = "price-lowtohigh" } = req.query;
        let filterQuery = {};

        // Apply category filter only if it exists
        if (category && category.trim().length > 0) {
            filterQuery.category = { $in: category.split(",").map(cat => cat.trim().toLowerCase()) };
        }

        if (brand && brand.trim().length > 0) {
            filterQuery.brand = { $in: brand.split(",").map(br => br.trim().toLowerCase()) };
        }

        // Sorting logic
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

        console.log("🔍 Final Filter Query:", JSON.stringify(filterQuery, null, 2));
        console.log("🔍 Final Sort Query:", JSON.stringify(sortQuery, null, 2));

        // Fetch all products if no filters are applied
        const products = Object.keys(filterQuery).length === 0 
            ? await Product.find().sort(sortQuery) 
            : await Product.find(filterQuery).sort(sortQuery);

        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        console.error("❌ Error in getFilterProducts:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching products"
        });
    }
};



const getProductDetails=async(req,res)=>{
    try {

        const {id} = req.params;
        const product = await Product.findById(id);

        if(!product) return res.status(404).json({
            success:false,
            message:"Product not found"
        })

        res.status(200).json({
            success:true,
            data : product
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching products"
        });
    }
}

module.exports = { getFilterProducts , getProductDetails };


