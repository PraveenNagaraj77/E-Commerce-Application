const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users");

// Register
const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const checkUser = await User.findOne({ email });
        if (checkUser)
            return res.json({
                success: false,
                message: "User already exists with this email! Please try again",
            });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(200).json({
            success: true,
            message: "Registration Successful",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred",
        });
    }
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser)
            return res.json({
                success: false,
                message: "User not found, please register",
            });

        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
        if (!checkPasswordMatch)
            return res.json({
                success: false,
                message: "Invalid password, please try again",
            });

        const token = jwt.sign(
            {
                id: checkUser._id,
                role: checkUser.role,
                email: checkUser.email,
                userName: checkUser.userName,
            },
            process.env.JWT_SECRET, // ✅ Use env variable
            { expiresIn: "60m" }
        );

        // ✅ Set secure cookies in production
        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });

        res.json({
            success: true,
            message: "Login successful",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                userName: checkUser.userName,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred",
        });
    }
};

// Logout
const logoutUser = (req, res) => {
    res.clearCookie("token", { sameSite: "None", secure: true }).json({
        success: true,
        message: "Logged out successfully",
    });
};

// Auth Middleware
const authMiddleWare = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.json({
            success: false,
            message: "Unauthorized user",
        });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized user",
        });
    }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleWare };
