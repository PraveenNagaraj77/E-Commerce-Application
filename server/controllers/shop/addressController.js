const Address = require("../../models/Address");

// ✅ Add a new address
const addAddress = async (req, res) => {
    try {
        const { userId, address, city, pincode, phone, notes } = req.body;

        // Validation
        if (!userId || !address || !city || !pincode || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Create new address
        const newAddress = new Address({
            userId,
            address,
            city,
            pincode,
            phone,
            notes,
        });

        await newAddress.save();

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            data: newAddress,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occurred while adding address",
        });
    }
};

// ✅ Fetch all addresses for a user
const fetchAllAddress = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const addresses = await Address.find({ userId });

        res.status(200).json({
            success: true,
            data: addresses,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching addresses",
        });
    }
};

// ✅ Edit an existing address
const editAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User and Address ID are required",
            });
        }

        const formData = req.body;

        const updatedAddress = await Address.findOneAndUpdate(
            { _id: addressId, userId },
            formData,
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: updatedAddress,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occurred while updating address",
        });
    }
};

// ✅ Delete an address
const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User and Address ID are required",
            });
        }

        const deletedAddress = await Address.findOneAndDelete({ _id: addressId, userId });

        if (!deletedAddress) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occurred while deleting address",
        });
    }
};

module.exports = { addAddress, fetchAllAddress, editAddress, deleteAddress };
