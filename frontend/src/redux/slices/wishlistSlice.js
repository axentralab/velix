import { createSlice } from '@reduxjs/toolkit';

// Load wishlist from localStorage
const loadWishlistFromStorage = () => {
  try {
    const savedWishlist = localStorage.getItem('veloura_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : { items: [] };
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error);
    return { items: [] };
  }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem('veloura_wishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

const initialState = loadWishlistFromStorage();

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (!existing) {
        state.items.push(action.payload);
        saveWishlistToStorage(state);
      }
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlistToStorage(state);
    },
    clearWishlist(state) {
      state.items = [];
      saveWishlistToStorage(state);
    },
    loadWishlist(state, action) {
      // Load wishlist from external source (e.g., backend for logged users)
      state.items = action.payload.items || [];
      saveWishlistToStorage(state);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, loadWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;