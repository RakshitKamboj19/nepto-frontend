import { createSlice } from '@reduxjs/toolkit';

// Load favorites from localStorage if available
const loadFavoritesFromStorage = () => {
  try {
    const favoritesFromStorage = localStorage.getItem('favorites');
    return favoritesFromStorage ? JSON.parse(favoritesFromStorage) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const initialState = {
  favorites: loadFavoritesFromStorage(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const productId = action.payload;
      // Check if product is already in favorites
      if (!state.favorites.includes(productId)) {
        state.favorites.push(productId);
        // Save to localStorage
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      state.favorites = state.favorites.filter(id => id !== productId);
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    clearFavorites: (state) => {
      state.favorites = [];
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
