import express from "express";
import {
  registerUser,
  authUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.get("/refresh", refreshAccessToken);

export default router;
