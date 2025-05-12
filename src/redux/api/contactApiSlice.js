import { apiSlice } from './apiSlice';

export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitContactForm: builder.mutation({
      query: (data) => ({
        url: '/contact',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSubmitContactFormMutation } = contactApiSlice;
