import express from "express";
import {
  registerUser,
  authUser,
  logoutUser,
  refreshAccessToken,
  googleAuthUser,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.get("/refresh", refreshAccessToken);
router.post("/google/auth", googleAuthUser);
router.put("/profile", updateUserProfile);

export default router;
