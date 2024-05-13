import express from "express";
import {
  allPurchases,
  getDiagram,
  getDiagrams,
  getFilters,
} from "../controllers/topSellersController.js";

const router = express.Router();

router.post("/all", allPurchases);
router.post("/filters", getFilters);
router.post("/diagram", getDiagram);
router.post("/diagrams", getDiagrams);

export default router;
