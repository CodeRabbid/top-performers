import asyncHandler from "express-async-handler";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";

import generateRefreshToken from "../utils/generateToken.js";

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

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    await generateRefreshToken(res, user);

    const payload = { _id: user._id };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    const { exp } = jwtDecode(access_token);

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
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const refresh_token = req.cookies?.refresh_token;

  if (refresh_token) {
    if (req.headers.auth_provider == "google") {
      const refreshClient = new UserRefreshClient(
        clientId,
        clientSecret,
        refresh_token
      );
      await refreshClient.revokeToken(refresh_token);
    } else {
      const { _id } = jwtDecode(refresh_token);
      const user = await User.findById(_id);
      user.refresh_token = undefined;
      await user.save();
    }
  }

  res.cookie("refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export { registerUser, authUser, logoutUser };
