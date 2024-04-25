import express from "express";
import { allPurchases } from "../controllers/purchaseController.js";
import { getFilters } from "../controllers/purchaseController.js";

const router = express.Router();

router.post("/all", allPurchases);
router.post("/filters", getFilters);

export default router;
