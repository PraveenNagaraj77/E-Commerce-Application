const express = require('express');

const { getFilterProducts ,getProductDetails } =  require('../../controllers/shop/productController')



const router = express.Router();


router.get('/get',getFilterProducts);
router.get('/get/:id',getProductDetails);




module.exports = router;