import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const USERS_URL = "/api/users";

const baseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: (headers, { getState }) => {
    const auth_provider = getState().auth?.userInfo?.auth_provider;
    if (auth_provider) {
      headers.set("auth_provider", `${auth_provider}`);
    }
    return headers;
  },
});

const apiSlice = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    googleLogin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/google/auth`,
        method: "POST",
        body: data,
      }),
    }),
    refreshAccessToken: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/refresh`,
        method: "GET",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGoogleLoginMutation,
  useRefreshAccessTokenMutation,
} = authApiSlice;
