const express = require("express");
const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/addressController");

const router = express.Router();

// Add a new address
router.post("/add", addAddress);

// Fetch all addresses for a user
router.get("/get/:userId", fetchAllAddress);

// Edit an existing address
router.put("/update/:userId/:addressId", editAddress);

// Delete an address
router.delete("/delete/:userId/:addressId", deleteAddress);

module.exports = router;
