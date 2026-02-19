import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage.getItem("cart")) || [],
  },
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find(
        (item) => item.foodId === action.payload.foodId
      );

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.foodId === action.payload
      );
      if (item) item.quantity += 1;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.foodId === action.payload
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.foodId !== action.payload
      );
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    setCart: (state, action) => {
      state.items = action.payload;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
  },
});

export const {
  addItem,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  setCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
