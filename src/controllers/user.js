import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { generateToken } from "../utils/jwt.js";
import userModel from "../models/user.js";

export const SignUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("SignIn Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getByToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
