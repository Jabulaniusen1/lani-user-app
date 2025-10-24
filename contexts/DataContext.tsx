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
      alert('Error fetching popular restaurants: ' + error);
      setErrorRestaurants('Failed to fetch popular restaurants');
    } finally {
      // alert('Loading state set to false');
      setLoadingRestaurants(false);
    }
  };

  // Fetch all restaurants
  const fetchAllRestaurants = async () => {
    console.log('📊 [DataContext] Starting to fetch all restaurants...');
    setLoadingRestaurants(true);
    setErrorRestaurants(null);
    try {
      console.log('📊 [DataContext] Calling FirestoreService.getAllRestaurants()...');
      const data = await FirestoreService.getAllRestaurants();
      console.log('📊 [DataContext] Received data from FirestoreService:', data);
      console.log(`📊 [DataContext] Setting ${data.length} restaurants in state`);
      setRestaurants(data);
    } catch (error) {
      console.error('📊 [DataContext] Error fetching restaurants:', error);
      console.error('📊 [DataContext] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      setErrorRestaurants('Failed to fetch restaurants');
    } finally {
      console.log('📊 [DataContext] Setting loading state to false');
      setLoadingRestaurants(false);
    }
  };

  // Fetch top meals
  const fetchTopMeals = async () => {
    console.log('📊 [DataContext] Starting to fetch top meals...');
    setLoadingMeals(true);
    setErrorMeals(null);
    try {
      console.log('📊 [DataContext] Calling FirestoreService.getTopMeals()...');
      const data = await FirestoreService.getTopMeals();
      console.log('📊 [DataContext] Received data from FirestoreService:', data);
      console.log(`📊 [DataContext] Setting ${data.length} top meals in state`);
      setTopMeals(data);
    } catch (error) {
      console.error('📊 [DataContext] Error fetching top meals:', error);
      console.error('📊 [DataContext] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      setErrorMeals('Failed to fetch top meals');
    } finally {
      console.log('📊 [DataContext] Setting loading state to false');
      setLoadingMeals(false);
    }
  };

  // Fetch restaurant by ID
  const fetchRestaurantById = async (id: string): Promise<Restaurant | null> => {
    console.log(`📊 [DataContext] Starting to fetch restaurant by ID: ${id}`);
    try {
      console.log('📊 [DataContext] Calling FirestoreService.getRestaurantById()...');
      const result = await FirestoreService.getRestaurantById(id);
      console.log('📊 [DataContext] Received restaurant data:', result);
      return result;
    } catch (error) {
      console.error('📊 [DataContext] Error fetching restaurant by ID:', error);
      console.error('📊 [DataContext] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown',
        restaurantId: id
      });
      return null;
    }
  };

  // Fetch meal by ID
  const fetchMealById = async (id: string): Promise<Meal | null> => {
    console.log(`📊 [DataContext] Starting to fetch meal by ID: ${id}`);
    try {
      console.log('📊 [DataContext] Calling FirestoreService.getMealById()...');
      const result = await FirestoreService.getMealById(id);
      console.log('📊 [DataContext] Received meal data:', result);
      return result;
    } catch (error) {
      console.error('📊 [DataContext] Error fetching meal by ID:', error);
      console.error('📊 [DataContext] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown',
        mealId: id
      });
      return null;
    }
  };

  // Fetch meals by restaurant
  const fetchMealsByRestaurant = async (restaurantId: string): Promise<Meal[]> => {
    console.log(`📊 [DataContext] Starting to fetch meals for restaurant: ${restaurantId}`);
    try {
      console.log('📊 [DataContext] Calling FirestoreService.getMealsByRestaurant()...');
      const result = await FirestoreService.getMealsByRestaurant(restaurantId);
      console.log('📊 [DataContext] Received meals data:', result);
      console.log(`📊 [DataContext] Returning ${result.length} meals for restaurant ${restaurantId}`);
      return result;
    } catch (error) {
      console.error('📊 [DataContext] Error fetching meals by restaurant:', error);
      console.error('📊 [DataContext] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown',
        restaurantId: restaurantId
      });
      return [];
    }
  };

  // Search meals
  const searchMeals = async (searchTerm: string): Promise<Meal[]> => {
    console.log(`📊 [DataContext] Starting to search meals with term: "${searchTerm}"`);
    try {
      console.log('📊 [DataContext] Calling FirestoreService.searchMeals()...');
      const result = await FirestoreService.searchMeals(searchTerm);
      console.log('📊 [DataContext] Received search results:', result);
      console.log(`📊 [DataContext] Returning ${result.length} search results for "${searchTerm}"`);
      return result;
    } catch (error) {
      console.error('📊 [DataContext] Error searching meals:', error);
      console.error('📊 [DataContext] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown',
        searchTerm: searchTerm
      });
      return [];
    }
  };

  // Refresh all data
  const refreshData = async () => {
    console.log('📊 [DataContext] Starting to refresh all data...');
    try {
      console.log('📊 [DataContext] Executing parallel data fetches...');
      await Promise.all([
        fetchPopularRestaurants(),
        fetchAllRestaurants(),
        fetchTopMeals(),
      ]);
      console.log('📊 [DataContext] All data refresh completed successfully');
    } catch (error) {
      console.error('📊 [DataContext] Error during data refresh:', error);
      console.error('📊 [DataContext] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
    }
  };

  // Load initial data
  useEffect(() => {
    console.log('📊 [DataContext] DataProvider mounted, loading initial data...');
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
