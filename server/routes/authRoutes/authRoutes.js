
const express = require("express");

const {
    registerUser,
    loginUser,
    logoutUser,
    authMiddleWare,
} = require("../../controllers/auth/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/checkauth", authMiddleWare, (req, res) => {
    res.set("Cache-Control", "no-store");

    res.status(200).json({
        success: true,
        message: "Authenticated User",
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            userName: req.user.userName,
        },
    });
});

module.exports = router;
