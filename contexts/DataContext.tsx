import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import FirestoreService, { Restaurant, Meal } from '../services/firestoreService';

interface DataContextType {
  // Restaurants
  popularRestaurants: Restaurant[];
  restaurants: Restaurant[];
  loadingRestaurants: boolean;
  errorRestaurants: string | null;
  
  // Meals
  topMeals: Meal[];
  loadingMeals: boolean;
  errorMeals: string | null;
  
  // Actions
  fetchPopularRestaurants: () => Promise<void>;
  fetchAllRestaurants: () => Promise<void>;
  fetchTopMeals: () => Promise<void>;
  fetchRestaurantById: (id: string) => Promise<Restaurant | null>;
  fetchMealById: (id: string) => Promise<Meal | null>;
  fetchMealsByRestaurant: (restaurantId: string) => Promise<Meal[]>;
  searchMeals: (searchTerm: string) => Promise<Meal[]>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Restaurants state
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [errorRestaurants, setErrorRestaurants] = useState<string | null>(null);

  // Meals state
  const [topMeals, setTopMeals] = useState<Meal[]>([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [errorMeals, setErrorMeals] = useState<string | null>(null);

  // Fetch popular restaurants
  const fetchPopularRestaurants = async () => {
    setLoadingRestaurants(true);
    setErrorRestaurants(null);
    try {
      const data = await FirestoreService.getPopularRestaurants();
      setPopularRestaurants(data);
    } catch (error) {
      setErrorRestaurants('Failed to fetch popular restaurants');
      console.error('Error fetching popular restaurants:', error);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  // Fetch all restaurants
  const fetchAllRestaurants = async () => {
    setLoadingRestaurants(true);
    setErrorRestaurants(null);
    try {
      const data = await FirestoreService.getAllRestaurants();
      setRestaurants(data);
    } catch (error) {
      setErrorRestaurants('Failed to fetch restaurants');
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  // Fetch top meals
  const fetchTopMeals = async () => {
    setLoadingMeals(true);
    setErrorMeals(null);
    try {
      const data = await FirestoreService.getTopMeals();
      setTopMeals(data);
    } catch (error) {
      setErrorMeals('Failed to fetch top meals');
      console.error('Error fetching top meals:', error);
    } finally {
      setLoadingMeals(false);
    }
  };

  // Fetch restaurant by ID
  const fetchRestaurantById = async (id: string): Promise<Restaurant | null> => {
    try {
      return await FirestoreService.getRestaurantById(id);
    } catch (error) {
      console.error('Error fetching restaurant by ID:', error);
      return null;
    }
  };

  // Fetch meal by ID
  const fetchMealById = async (id: string): Promise<Meal | null> => {
    try {
      return await FirestoreService.getMealById(id);
    } catch (error) {
      console.error('Error fetching meal by ID:', error);
      return null;
    }
  };

  // Fetch meals by restaurant
  const fetchMealsByRestaurant = async (restaurantId: string): Promise<Meal[]> => {
    try {
      return await FirestoreService.getMealsByRestaurant(restaurantId);
    } catch (error) {
      console.error('Error fetching meals by restaurant:', error);
      return [];
    }
  };

  // Search meals
  const searchMeals = async (searchTerm: string): Promise<Meal[]> => {
    try {
      return await FirestoreService.searchMeals(searchTerm);
    } catch (error) {
      console.error('Error searching meals:', error);
      return [];
    }
  };

  // Refresh all data
  const refreshData = async () => {
    await Promise.all([
      fetchPopularRestaurants(),
      fetchAllRestaurants(),
      fetchTopMeals(),
    ]);
  };

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  const value: DataContextType = {
    // Restaurants
    popularRestaurants,
    restaurants,
    loadingRestaurants,
    errorRestaurants,
    
    // Meals
    topMeals,
    loadingMeals,
    errorMeals,
    
    // Actions
    fetchPopularRestaurants,
    fetchAllRestaurants,
    fetchTopMeals,
    fetchRestaurantById,
    fetchMealById,
    fetchMealsByRestaurant,
    searchMeals,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
