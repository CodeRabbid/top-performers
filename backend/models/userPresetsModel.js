import mongoose from "mongoose";

const userPresetsSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  selectedFilters: {
    type: [Object],
  },
});

const UserPresets = mongoose.model("UserPresets", userPresetsSchema);

export default UserPresets;
