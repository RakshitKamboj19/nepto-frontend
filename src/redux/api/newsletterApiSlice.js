import { apiSlice } from './apiSlice';

export const newsletterApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: '/newsletter/subscribe',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSubscribeNewsletterMutation } = newsletterApiSlice;
