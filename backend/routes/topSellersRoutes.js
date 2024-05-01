import express from "express";
import {
  allPurchases,
  getDiagram,
  getFilters,
} from "../controllers/topSellersController.js";

const router = express.Router();

router.post("/all", allPurchases);
router.post("/filters", getFilters);
router.post("/diagram", getDiagram);

export default router;
