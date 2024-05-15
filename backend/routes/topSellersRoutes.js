import express from "express";
import {
  allPurchases,
  getDiagram,
  getDiagrams,
  getFilters,
} from "../controllers/topSellersController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/all").post(protect, allPurchases);
router.route("/filters").post(protect, getFilters);
router.route("/diagram").post(protect, getDiagram);
router.route("/diagrams").post(protect, getDiagrams);

export default router;
