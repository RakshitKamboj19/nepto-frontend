import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Add this to your endpoints
fetchCategories: builder.query({
  query: () => '/products/categories',
  keepUnusedDataFor: 5,
  providesTags: ['Product'],
}),
// Add this to your endpoints
uploadProductImage: builder.mutation({
  query: (data) => ({
    url: '/upload',  // or whatever your upload endpoint is
    method: 'POST',
    body: data,
  }),
  invalidatesTags: ['Product'],
}),
getFilteredProducts: builder.query({
  query: ({ categories, minPrice, maxPrice }) => ({
    url: `/products/filter?categories=${categories}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
  }),
  keepUnusedDataFor: 5,
  providesTags: ['Product'],
}),
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: `/products?keyword=${keyword}&pageNumber=${pageNumber}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    allProducts: builder.query({
      query: () => '/products/allproducts',
      keepUnusedDataFor: 0, // Don't cache the data
      providesTags: ['Product'],
      // Force revalidation on each query
      forceRefetch: ({ currentArg, previousArg }) => true,
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    createProductReview: builder.mutation({
      query: ({ id, ...review }) => ({
        url: `/products/${id}/reviews`,
        method: 'POST',
        body: review,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => '/products/top',
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    getNewProducts: builder.query({
      query: () => '/products/new',
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    filterProducts: builder.query({
      query: ({ categories, minPrice, maxPrice }) => ({
        url: `/products/filter?categories=${categories}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useFilterProductsQuery,
  useFetchCategoriesQuery,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
} = productApiSlice;
