import express from "express";
import { allPurchases } from "../controllers/topSellersController.js";
import { getFilters } from "../controllers/topSellersController.js";

const router = express.Router();

router.post("/all", allPurchases);
router.post("/filters", getFilters);

export default router;
