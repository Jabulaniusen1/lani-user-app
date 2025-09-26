import { createSlice } from "@reduxjs/toolkit";
import { ImageSourcePropType } from "react-native";

interface PopularResturant {
  id: string;
  name: string;
  location: string;
  image: ImageSourcePropType;
  rating: number;
  reviews: number;
  deliveryTime: string;
}
interface TopMeal {
  id: string;
  name: string;
  description: string;
  price: string;
  image: ImageSourcePropType;
  restaurant: string;
}

interface EatState {
  popularResturants: PopularResturant[];
  topMeal: TopMeal[];
}
const initialState: EatState = {
  popularResturants: [
    {
      id: "1",
      name: "Eni Stores",
      location: "Nsikak Eduok",
      image: require("../assets/images/eni-stores.png"),
      rating: 4.5,
      reviews: 1234,
      deliveryTime: "25-30 min",
    },
    {
      id: "2",
      name: "Kilimanjaro",
      location: "Ikot Ekpene Road",
      image: require("../assets/images/kilimajaro.png"),
      rating: 4.3,
      reviews: 856,
      deliveryTime: "20-25 min",
    },
    {
      id: "3",
      name: "Chicken Republic",
      location: "Ikot Ekpene Road",
      image: require("../assets/images/chicken-republic.png"),
      rating: 4.7,
      reviews: 2103,
      deliveryTime: "15-20 min",
    },
    {
      id: "4",
      name: "Pizza Palace",
      location: "Main Street",
      image: require("../assets/images/laanieats-logo.png"), // Keep logo for Pizza Palace since no specific image
      rating: 4.2,
      reviews: 567,
      deliveryTime: "30-35 min",
    },
  ],

  topMeal: [
    {
      id: "1",
      name: "Shawarma & Coke",
      description:
        "Spicy beef or chicken shawarma wrapped fresh, served with ice-cold Coke.",
      price: "₦2,500",
      image: require("@/assets/images/shawarma-and-coke.png"),
      restaurant: "Kilimanjaro",
    },
    {
      id: "2",
      name: "Jellof Rice & Plantain",
      description:
        "Naija-style jollof rice with crispy, golden plantain slices. Pure comfort food.",
      price: "₦2,200",
      image: require("@/assets/images/jellof-rice.png"),
      restaurant: "Eni Stores",
    },
    {
      id: "3",
      name: "Chicken & Chips",
      description: "Crispy fried chicken with golden fries and special sauce.",
      price: "₦3,000",
      image: require("@/assets/images/laanieats-logo.png"), // Keep logo since no specific image exists
      restaurant: "Chicken Republic",
    },
    {
      id: "4",
      name: "Okro Soup & Garri",
      description:
        "Spicy Nigerian okro soup with assorted meat and vegetables, served with garri.",
      price: "₦1,800",
      image: require("@/assets/images/okra-soup.png"),
      restaurant: "Eni Stores",
    },
  ],
};

export const eatSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = eatSlice.actions;

export default eatSlice.reducer;
