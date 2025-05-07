const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Generate JWT token
const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn:"1h"});

}
//register user
exports.registerUser = async (req, res) => {
    const {fullName, email, password, profileImageUrl} = req.body;

    // Check for missing values
    if(!fullName || !email || !password){
        return res.status(400).json({message: "Please fill all fields"});
    }

    try{
        //Checking if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        //Create new user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl: profileImageUrl || "",
        }); 

        const token = generateToken(user._id);
        // console.log("User created:", user);  // DEBUG
        // console.log("Token generated:", token);  // DEBUG
    

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        })
            
    }catch(err){
        res
            .status(500)
            .json({message: "Server error" ,err: err.message});

    }


}
exports.loginUser = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: "Please fill all fields"});
    }try{
        const user = await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({message: "Invalid credentials"});
        }
        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        })
    }catch(err){
        res.status(500).json({message: "Server error", err: err.message});
    }
    
}
exports.getUserInfo= async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }catch(err){
        res
            .status(500)
            .json({message: "Server error", err: err.message});
    }
    
}