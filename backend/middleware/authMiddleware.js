import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { OAuth2Client } from "google-auth-library";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectURI = process.env.GOOGLE_LOGIN_REDIRECT_URI;

const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectURI);

const protect = asyncHandler(async (req, res, next) => {
  const access_token = req.headers.authorization?.split(" ")[1];
  const auth_provider = req.headers.auth_provider;

  if (access_token) {
    if (auth_provider == "google") {
      try {
        const decoded = oAuth2Client.getTokenInfo(access_token);
        req.user = await User.findOne({ email: decoded.email }).select(
          "-password"
        );
        next();
      } catch (error) {
        return res.status(401).send({
          message: "Not authorized, token failed",
        });
      }
    } else {
      try {
        const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id).select("-password");
        next();
      } catch (error) {
        return res.status(401).send({
          message: "Not authorized, token failed",
        });
      }
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
