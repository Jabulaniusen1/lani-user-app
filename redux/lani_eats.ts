import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Restaurant {
  id: string;
  name: string;
  location?: string;
  address?: string; // Restaurant address
  image?: string;
  coverImage?: string; // Restaurant cover photo
  logo?: string; // Restaurant logo
  rating?: number;
  reviews?: number;
  deliveryTime?: string;
  description?: string;
  isOpen?: boolean;
  category?: string;
  ownerId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurantId: string;
  restaurantName: string;
  category: string;
  isAvailable: boolean;
  preparationTime: number;
  rating?: number;
  reviews?: number;
}

interface EatState {
  popularRestaurants: Restaurant[];
  topMeals: Meal[];
  loading: boolean;
  error: string | null;
}

const initialState: EatState = {
  popularRestaurants: [],
  topMeals: [],
  loading: false,
  error: null,
};

export const eatSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPopularRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.popularRestaurants = action.payload;
    },
    setTopMeals: (state, action: PayloadAction<Meal[]>) => {
      state.topMeals = action.payload;
    },
    clearData: (state) => {
      state.popularRestaurants = [];
      state.topMeals = [];
      state.loading = false;
      state.error = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { 
  setLoading, 
  setError, 
  setPopularRestaurants, 
  setTopMeals, 
  clearData 
} = eatSlice.actions;

export default eatSlice.reducer;
