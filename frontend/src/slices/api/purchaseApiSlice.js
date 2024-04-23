import { apiSlice } from "./baseApiSlice";
const PURCHASE_URL = "/api/purchase";

export const purchaseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allPurchases: builder.mutation({
      query: (data) => ({
        url: `${PURCHASE_URL}/all`,
        method: "GET",
        body: data,
      }),
    }),
  }),
});

export const { useAllPurchasesMutation } = purchaseApiSlice;
