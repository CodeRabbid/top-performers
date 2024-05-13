import express from "express";
import { saveDiagramSelectedFilters } from "../controllers/userPresetController.js";

const router = express.Router();

router.post("/diagram/selected-filters/save", saveDiagramSelectedFilters);

export default router;
