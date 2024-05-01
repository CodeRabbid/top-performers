import { apiSlice } from "./baseApiSlice";
const PURCHASE_URL = "/api/purchase";

export const itemsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.mutation({
      query: (data) => ({
        url: `${PURCHASE_URL}/all`,
        method: "POST",
        body: data,
      }),
    }),
    getFilters: builder.mutation({
      query: (data) => ({
        url: `${PURCHASE_URL}/filters`,
        method: "POST",
        body: data,
      }),
    }),
    getDiagram: builder.mutation({
      query: (data) => ({
        url: `${PURCHASE_URL}/diagram`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetItemsMutation,
  useGetFiltersMutation,
  useGetDiagramMutation,
} = itemsApiSlice;
