import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: (headers, { getState }) => {
    const access_token = getState().auth?.userInfo?.access_token;
    const auth_provider = getState().auth?.userInfo?.auth_provider;
    if (access_token) {
      headers.set("authorization", `Bearer ${access_token}`);
    }
    if (auth_provider) {
      headers.set("auth_provider", `${auth_provider}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  if (
    (api.getState().auth?.userInfo?.expiry_date - 60 * 10) * 1000 <
    Date.now()
  ) {
    try {
      const refreshResult = await baseQuery(
        "/api/users/refresh",
        api,
        extraOptions
      );

      if (refreshResult.data) {
        api.dispatch(setCredentials(refreshResult.data));
        return await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } catch (err) {
      console.error(err?.data?.message || err.error);
    }
  }

  return await baseQuery(args, api, extraOptions);
};

export const apiSlice = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
