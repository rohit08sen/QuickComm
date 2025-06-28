import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Validate password length
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required....." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User Exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user in one step
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    generateToken(newUser._id, res);

    // Respond with success
    res.status(201).json({
      _id: newUser._id,
      message: "User registered...",
    });
  } catch (error) {
    console.log("Error in register", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message:"Invalid Credentials."
      })
    };

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid Credentials.",
      });
    }
    generateToken(user._id, res);
    res.status(200).json({
      message: "Login Sucessfull",
      fullName: user.fullName,
      email: user.email,
      profilePic:user.profilePic
    })
  } catch (error) {
    console.log("Error in Login", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Loggedout Sucessfully",
    });
  } catch (error) {
    console.log("Error in Logout", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProfile = async (req,res) => {
  
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({
        message: "Profile pic required",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
    res.status(200).json(updateUser)
  } catch (error) {
    console.log("error in update profile: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}