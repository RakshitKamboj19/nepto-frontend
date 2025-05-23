import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'same-origin', // Changed from 'include' to 'same-origin' to fix CORS issues
    mode: 'cors' // Explicitly set CORS mode
  }),
  tagTypes: ['Product', 'Order', 'User', 'Category'],
  endpoints: (builder) => ({}),
});
