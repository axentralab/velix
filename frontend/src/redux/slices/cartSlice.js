import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('veloura_cart');
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return { items: [] };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('veloura_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      saveCartToStorage(state);
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToStorage(state);
    },
    updateQuantity(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      saveCartToStorage(state);
    },
    clearCart(state) {
      state.items = [];
      saveCartToStorage(state);
    },
    loadCart(state, action) {
      // Load cart from external source (e.g., backend for logged users)
      state.items = action.payload.items || [];
      saveCartToStorage(state);
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;
