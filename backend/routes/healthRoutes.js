import express from "express";
import { refreshAccessToken } from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "hello" });
});

export default router;
