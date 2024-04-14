import asyncHandler from "express-async-handler";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const payload = { _id: user._id };

    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const { exp } = jwtDecode(access_token);
    const refresh_token = jwt.sign(payload, process.env.JWT_SECRET);
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
    });

    res.json({
      access_token: access_token,
      expiry_date: exp,
      auth_provider: "custom",
      user_info: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export { registerUser };
