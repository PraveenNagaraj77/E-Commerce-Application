const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/Users')

// Register

const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const checkUser = await User.findOne({email})
        if(checkUser) return res.json({success:false,message:"User Already exists with same email! Please Try Again"})
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName, email, password: hashedPassword,
        })

        await newUser.save()
        res.status(200).json({
            success: true,
            message: "Registration Successfull"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Some error Occured"
        })
    }

}


// Login

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {
        const checkUser = await User.findOne({email});
        if(!checkUser) return res.json({
            success:false,
            message:"User not found,Please Register"
        })

        const checkPasswordMatch = await bcrypt.compare(password,checkUser.password)
        if(!checkPasswordMatch) return res.json({
            success:false,
            message:"Invalid Password Please try again"
        })

        const token = jwt.sign({
            id: checkUser._id,role:checkUser.role,
            email:checkUser.email,
            userName : checkUser.userName,
        },'CLIENT_SECRET_KEY',{expiresIn:'60m'})

        res.cookie('token',token,{httpOnly:true,secure:false}).json({
            success:true,
            message:"Login Successfull",
            user:{
                email : checkUser.email,
                role:checkUser.role,
                id: checkUser._id,
                userName : checkUser.userName,
            }
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Some error Occured"
        })
    }

}


// Logout

const logoutUser =(req,res)=>{
    res.clearCookie('token').json({
        success:true,
        message:"Logout Successfully",
    })
}


// Auth MiddleWare]

const authMiddleWare = async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token) return res.json({
        success:false,
        message:"Unauthorized User",
    })

    try {
        const decoded = jwt.verify(token,'CLIENT_SECRET_KEY');
        req.user = decoded;
        next()
    } catch (error) {
        res.status(401).json({
            success:false,
            message:"Unauthorized User"
        })
    }
}


module.exports={registerUser,loginUser,logoutUser, authMiddleWare};