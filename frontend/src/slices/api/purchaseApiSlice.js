import { apiSlice } from "./baseApiSlice";
const PURCHASE_URL = "/api/purchase";

export const purchaseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allPurchases: builder.mutation({
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
  }),
});

export const { useAllPurchasesMutation, useGetFiltersMutation } =
  purchaseApiSlice;
