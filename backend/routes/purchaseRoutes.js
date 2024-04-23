import express from "express";
import { allPurchases } from "../controllers/purchaseController.js";

const router = express.Router();

router.get("/all", allPurchases);

export default router;
