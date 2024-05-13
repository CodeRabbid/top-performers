import express from "express";
import {
  saveDiagramSelectedFilters,
  loadDiagramSelectedFilters,
} from "../controllers/userPresetController.js";

const router = express.Router();

router.post("/diagram/selected-filters/save", saveDiagramSelectedFilters);
router.post("/diagram/selected-filters/load", loadDiagramSelectedFilters);

export default router;
