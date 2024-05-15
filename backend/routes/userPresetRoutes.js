import express from "express";
import {
  saveDiagramSelectedFilters,
  loadDiagramSelectedFilters,
} from "../controllers/userPresetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/diagram/selected-filters/save")
  .post(protect, saveDiagramSelectedFilters);
router
  .route("/diagram/selected-filters/load")
  .post(protect, loadDiagramSelectedFilters);

export default router;
