import { apiSlice } from "./baseApiSlice";
const USER_PRESET_URL = "/api/user-preset";

export const userPresetApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveSelectedFilters: builder.mutation({
      query: (data) => ({
        url: `${USER_PRESET_URL}/diagram/selected-filters/save`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useSaveSelectedFiltersMutation,
  useLoadSelectedFiltersMutation,
} = userPresetApiSlice;
