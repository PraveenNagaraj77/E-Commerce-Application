const express = require("express");
const { registerUser, loginUser, logoutUser, authMiddleWare } = require("../../controllers/auth/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// ✅ Check Authentication Route
router.get("/checkauth", authMiddleWare, (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://e-commercebypraveen.onrender.com"); // Allow frontend
    res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow cookies
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    const user = req.user;
    res.status(200).json({
        success: true,
        message: "Authenticated User",
        user,
    });
});

module.exports = router;
