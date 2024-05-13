import asyncHandler from "express-async-handler";
import UserPresets from "../models/userPresetsModel.js";

const saveDiagramSelectedFilters = asyncHandler(async (req, res) => {
  try {
    const userPresets = await UserPresets.findOneAndUpdate(
      { user_id: req.body.user_id },
      { user_id: req.body.user_id, selectedFilters: req.body.selectedFilters },
      { new: true, upsert: true }
    );

    res.json({ message: "Filters saved successfully" });
  } catch (err) {
    throw new Error("Error saving filters");
  }
});

export { saveDiagramSelectedFilters };
