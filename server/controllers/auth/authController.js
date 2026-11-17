const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users");

const TOKEN_EXPIRY = "7d";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        path: "/",
    };
};

// Register
const registerUser = async (req, res) => {
    const { userName, email, password, role } = req.body;

    try {
        const checkUser = await User.findOne({ email });

        if (checkUser) {
            return res.json({
                success: false,
                message: "User already exists with this email! Please try again",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        await newUser.save();

        return res.status(200).json({
            success: true,
            message: "Registration Successful",
        });
    } catch (error) {
        console.error("Registration Error:", error);

        return res.status(500).json({
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

        if (!checkUser) {
            return res.json({
                success: false,
                message: "User not found, please register",
            });
        }

        const checkPasswordMatch = await bcrypt.compare(
            password,
            checkUser.password
        );

        if (!checkPasswordMatch) {
            return res.json({
                success: false,
                message: "Invalid password, please try again",
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        const token = jwt.sign(
            {
                id: checkUser._id.toString(),
                role: checkUser.role,
                email: checkUser.email,
                userName: checkUser.userName,
            },
            process.env.JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );

        res.cookie("token", token, {
            ...getCookieOptions(),
            maxAge: COOKIE_MAX_AGE,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id.toString(),
                userName: checkUser.userName,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "An error occurred",
        });
    }
};

// Logout
const logoutUser = (req, res) => {
    res.clearCookie("token", getCookieOptions());

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

// Authentication Middleware
const authMiddleWare = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user",
        });
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        return next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Unauthorized user. Invalid or expired token.",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    authMiddleWare,
};