import asyncHandler from "express-async-handler";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";

import generateRefreshToken from "../utils/generateToken.js";
import { OAuth2Client, UserRefreshClient } from "google-auth-library";

import User from "../models/userModel.js";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectURI = process.env.GOOGLE_LOGIN_REDIRECT_URI;

const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectURI);

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

    user.refresh_token = refresh_token;
    await user.save();

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

const googleAuthUser = asyncHandler(async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code);
    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
    });

    const user_info = jwtDecode(tokens.id_token);

    const update = {
      name: user_info.name,
      email: user_info.email,
      picture: user_info.picture,
    };
    const user = await User.findOneAndUpdate(
      { email: user_info.email },
      update,
      {
        new: true,
        upsert: true,
      }
    );
    res.json({
      access_token: tokens.access_token,
      expiry_date: tokens.expiry_date,
      auth_provider: "google",
      user_info: {
        _id: user._id,
        name: user_info.name,
        email: user_info.email,
        picture: user_info.picture,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "There was an error authenticating with google",
    });
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refresh_token = req.cookies?.refresh_token;
  const auth_provider = req.headers.auth_provider;

  if (refresh_token) {
    if (auth_provider == "google") {
      const refreshClient = new UserRefreshClient(
        clientId,
        clientSecret,
        refresh_token
      );
      const response = await refreshClient.refreshAccessToken();
      const id_token = jwtDecode(response.credentials.id_token);

      const update = {
        name: id_token.name,
        email: id_token.email,
        picture: id_token.picture,
      };
      const user = await User.findOneAndUpdate(
        { email: id_token.email },
        update,
        {
          new: true,
          upsert: true,
        }
      );

      res.json({
        access_token: response.credentials.access_token,
        expiry_date: response.credentials.expiry_date,
        auth_provider: "google",
        user_info: {
          _id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
        },
      });
    } else {
      try {
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("-password");
        if (user && user.refresh_token && user.refresh_token == refresh_token) {
          const access_token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "110m" }
          );
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
          return res.status(401).send({
            message: "Not authorized, refresh token revoked",
          });
        }
      } catch (error) {
        console.error(error);
        return res.status(401).send({
          message: "Not authorized, refresh token failed",
        });
      }
    }
  } else {
    return res.status(401).send({
      message: "Not authorized, no refresh token",
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.credentials._id);

  if (user) {
    user.name = req.body.credentials.name || user.name;
    user.email = req.body.credentials.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      user_info: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
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
      if (user) {
        user.refresh_token = undefined;
        await user.save();
      }
    }
  }

  res.cookie("refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export {
  registerUser,
  authUser,
  logoutUser,
  refreshAccessToken,
  googleAuthUser,
  updateUserProfile,
};
