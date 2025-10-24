import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  orderBy, 
  limit,
  where,
  collectionGroup,
} from 'firebase/firestore';
import { db } from '../auth/firebase';

export interface Restaurant {
  id: string;
  name: string;
  ownerId: string;
  createdAt: any;
  // Optional fields that might exist
  location?: string;
  image?: string;
  coverImage?: string; // Restaurant cover photo
  logo?: string; // Restaurant logo
  rating?: number;
  reviews?: number;
  deliveryTime?: string;
  description?: string;
  isOpen?: boolean;
  category?: string;
  address?: string; // Restaurant address
  updatedAt?: any; // Last updated timestamp
}

export interface Meal {
  id: string;
  name: string;
  description: string; // Can be empty string from database
  price: number;
  image: string;
  restaurantId: string;
  restaurantName?: string; // Optional since it might not be in the database
  category: string;
  available: boolean; // Database field name
  prepTime: number; // Database field name
  // Interface compatibility fields
  isAvailable?: boolean; // For backward compatibility
  preparationTime?: number; // For backward compatibility
  rating?: number;
  reviews?: number;
  userId?: string; // Added since it exists in your database
  createdAt?: any; // Added since it exists in your database
}

export interface Order {
  id: string;
  userId: string;
  items: {
    mealId: string;
    mealName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  phoneNumber: string;
  createdAt: Date;
  estimatedDelivery: Date;
}

class FirestoreService {
  // Helper function to map database fields to interface
  private mapMealData(doc: any): Meal {
    const data = doc.data();
    
    // Debug logging to see what's actually in the database
    console.log(`🍽️ [FirestoreService] Raw meal data for ${doc.id}:`, {
      name: data.name,
      price: data.price,
      image: data.image,
      available: data.available,
      prepTime: data.prepTime,
      category: data.category,
      description: data.description,
      restaurantId: data.restaurantId,
      userId: data.userId,
      createdAt: data.createdAt,
      allFields: Object.keys(data)
    });
    
    const mappedMeal = {
      id: doc.id,
      // Spread all data from database first
      ...data,
      // Ensure description is handled properly (can be empty string)
      description: data.description || '',
      // Map field names to match interface
      isAvailable: data.available,
      preparationTime: data.prepTime,
      // Add restaurant name if not present
      restaurantName: data.restaurantName || 'Unknown Restaurant'
    } as Meal;
    
    console.log(`🍽️ [FirestoreService] Mapped meal data:`, {
      name: mappedMeal.name,
      price: mappedMeal.price,
      image: mappedMeal.image,
      description: mappedMeal.description,
      available: mappedMeal.available,
      prepTime: mappedMeal.prepTime,
      category: mappedMeal.category,
      restaurantId: mappedMeal.restaurantId,
      isAvailable: mappedMeal.isAvailable,
      preparationTime: mappedMeal.preparationTime
    });
    
    return mappedMeal;
  }

  // Helper function to map restaurant database fields to interface
  private mapRestaurantData(doc: any): Restaurant {
    const data = doc.data();
    
    // Debug logging to see what's actually in the database
    console.log(`🏪 [FirestoreService] Raw restaurant data for ${doc.id}:`, {
      coverImage: data.coverImage,
      logo: data.logo,
      address: data.address,
      name: data.name,
      allFields: Object.keys(data)
    });
    
    const mappedRestaurant = {
      id: doc.id,
      // Spread all data from database (this includes coverImage, logo, address, etc.)
      ...data,
      // Add fallback values for missing fields only
      location: data.location || data.address || 'Uyo, Akwa Ibom State',
      image: data.image || data.coverImage || 'https://via.placeholder.com/400x200?text=Restaurant+Cover',
      rating: data.rating || 4.5,
      reviews: data.reviews || Math.floor(Math.random() * 100) + 10,
      deliveryTime: data.deliveryTime || '30-45 min',
      description: data.description || 'Experience delicious local cuisine and authentic flavors at our restaurant.',
      isOpen: data.isOpen !== undefined ? data.isOpen : true,
      category: data.category || 'Restaurant'
    } as Restaurant;
    
    console.log(`🏪 [FirestoreService] Mapped restaurant data:`, {
      coverImage: mappedRestaurant.coverImage,
      logo: mappedRestaurant.logo,
      address: mappedRestaurant.address
    });
    
    return mappedRestaurant;
  }

  // Restaurants
  async getPopularRestaurants(): Promise<Restaurant[]> {
    console.log('🔥 [FirestoreService] Starting to fetch all restaurants...');
    try {
      console.log('🔥 [FirestoreService] Building query for all restaurants...');
      const q = query(
        collection(db, 'restaurants')
        // Removed filters - get all restaurants
      );

      console.log('🔥 [FirestoreService] Executing query...');
      const snapshot = await getDocs(q);
      
      console.log(`🔥 [FirestoreService] Query completed. Found ${snapshot.docs.length} restaurants`);
      console.log('🔥 [FirestoreService] Raw snapshot data:', snapshot.docs.map(doc => ({ 
        id: doc.id,
        path: doc.ref.path,
        data: doc.data() 
      })));
      
      const restaurants = snapshot.docs.map(doc => this.mapRestaurantData(doc));
      
      console.log('🔥 [FirestoreService] Processed restaurants:', restaurants);
      return restaurants;
    } catch (error) {
      console.error('🔥 [FirestoreService] Error fetching restaurants:', error);
      console.error('🔥 [FirestoreService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      return [];
    }
  }

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      const docRef = doc(db, 'restaurants', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const restaurantData = this.mapRestaurantData(docSnap);
        console.log('🔥 [FirestoreService] Restaurant data:', restaurantData);
        return restaurantData;
      }
      
      console.log('🔥 [FirestoreService] Restaurant not found');
      return null;
    } catch (error) {
      console.error('🔥 [FirestoreService] Error fetching restaurant:', error);
      console.error('🔥 [FirestoreService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown',
        restaurantId: id
      });
      return null;
    }
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    console.log('🔥 [FirestoreService] Starting to fetch all restaurants (getAllRestaurants)...');
    try {
      console.log('🔥 [FirestoreService] Building query for all restaurants...');
      const q = query(
        collection(db, 'restaurants')
        // Removed isOpen filter - get all restaurants
      );
      
      console.log('🔥 [FirestoreService] Executing query...');
      const snapshot = await getDocs(q);
      
      console.log(`🔥 [FirestoreService] Query completed. Found ${snapshot.docs.length} restaurants`);
      console.log('🔥 [FirestoreService] Raw snapshot data:', snapshot.docs.map(doc => ({ 
        id: doc.id,
        path: doc.ref.path,
        data: doc.data() 
      })));
      
      const restaurants = snapshot.docs.map(doc => this.mapRestaurantData(doc));
      
      console.log('🔥 [FirestoreService] Processed restaurants:', restaurants);
      return restaurants;
    } catch (error) {
      console.error('🔥 [FirestoreService] Error fetching restaurants:', error);
      console.error('🔥 [FirestoreService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      return [];
    }
  }

  // Meals
  async getTopMeals(): Promise<Meal[]> {
    console.log('🔥 [FirestoreService] Starting to fetch top meals using collection group query...');
    try {
      console.log('🔥 [FirestoreService] Building collection group query for menus...');
      const q = query(
        collectionGroup(db, 'menus'), // Query all menus subcollections
        where('available', '==', true), // Changed from 'isAvailable' to 'available'
        orderBy('rating', 'desc'),
        limit(10)
      );
      
      console.log('🔥 [FirestoreService] Executing collection group query...');
      const snapshot = await getDocs(q);
      
      console.log(`🔥 [FirestoreService] Collection group query completed. Found ${snapshot.docs.length} meals`);
      console.log('🔥 [FirestoreService] Raw snapshot data:', snapshot.docs.map(doc => ({ 
        id: doc.id,
        path: doc.ref.path,
        data: doc.data() 
      })));
      
      const meals = snapshot.docs.map(doc => this.mapMealData(doc));
      
      console.log('🔥 [FirestoreService] Processed meals from collection group:', meals);
      return meals;
    } catch (error) {
      console.error('🔥 [FirestoreService] Error fetching top meals:', error);
      console.error('🔥 [FirestoreService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      return [];
    }
  }

  async getMealById(id: string): Promise<Meal | null> {
    console.log(`🔥 [FirestoreService] Starting to fetch meal by ID: ${id}`);
    try {
      console.log('🔥 [FirestoreService] Using collection group query to find meal...');
      
      // Since we can't use documentId() with collection groups directly,
      // we'll query all menus and filter by ID
      const q = query(
        collectionGroup(db, 'menus'),
        where('available', '==', true)
      );
      
      console.log('🔥 [FirestoreService] Executing collection group query...');
      const snapshot = await getDocs(q);
      
      console.log(`🔥 [FirestoreService] Collection group query completed. Found ${snapshot.docs.length} meals`);
      
      // Find the specific meal by ID
      const mealDoc = snapshot.docs.find(doc => doc.id === id);
      
      if (mealDoc) {
        const mealData = this.mapMealData(mealDoc);
        console.log('🔥 [FirestoreService] Meal data:', mealData);
        return mealData;
      }
      
      console.log('🔥 [FirestoreService] Meal not found');
      return null;
    } catch (error) {
      console.error('🔥 [FirestoreService] Error fetching meal:', error);
      console.error('🔥 [FirestoreService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown',
        mealId: id
      });
      return null;
    }
  }

  async getMealsByRestaurant(restaurantId: string): Promise<Meal[]> {
    console.log(`🔥 [FirestoreService] Starting to fetch meals for restaurant: ${restaurantId}`);
    try {
      console.log('🔥 [FirestoreService] Building query for restaurant menus subcollection...');
      const q = query(
        collection(db, 'restaurants', restaurantId, 'menus'), // Query the menus subcollection
        where('available', '==', true), // Changed from 'isAvailable' to 'available'
        orderBy('name')
      );
      
      console.log('🔥 [FirestoreService] Executing query...');
      const snapshot = await getDocs(q);
      
      console.log(`🔥 [FirestoreService] Query completed. Found ${snapshot.docs.length} meals for restaurant ${restaurantId}`);
      console.log('🔥 [FirestoreService] Raw snapshot data:', snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
      
      const meals = snapshot.docs.map(doc => this.mapMealData(doc));
      
      console.log('🔥 [FirestoreService] Processed meals:', meals);
      return meals;
    } catch (error) {
      console.error('🔥 [FirestoreService] Error fetching restaurant meals:', error);
      console.error('🔥 [FirestoreService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown',
        restaurantId: restaurantId
      });
      return [];
    }
  }

  async searchMeals(searchTerm: string): Promise<Meal[]> {
    console.log(`🔥 [FirestoreService] Starting to search meals with term: "${searchTerm}"`);
    try {
      console.log('🔥 [FirestoreService] Building collection group query for meal search...');
      const q = query(
        collectionGroup(db, 'menus'), // Query all menus subcollections
        where('available', '==', true), // Changed from 'isAvailable' to 'available'
        orderBy('name')
      );
      
      console.log('🔥 [FirestoreService] Executing collection group query...');
      const snapshot = await getDocs(q);
      
      console.log(`🔥 [FirestoreService] Collection group query completed. Found ${snapshot.docs.length} total meals`);
      console.log('🔥 [FirestoreService] Raw snapshot data:', snapshot.docs.map(doc => ({ 
        id: doc.id, 
        path: doc.ref.path,
        data: doc.data() 
      })));
      
      const allMeals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Meal));
      
      console.log('🔥 [FirestoreService] All meals before filtering:', allMeals);
      
      // Filter by search term (case-insensitive)
      const filteredMeals = allMeals.filter(meal => 
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      console.log(`🔥 [FirestoreService] Filtered meals (${filteredMeals.length} results):`, filteredMeals);
      return filteredMeals;
    } catch (error) {
      console.error('🔥 [FirestoreService] Error searching meals:', error);
      console.error('🔥 [FirestoreService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown',
        searchTerm: searchTerm
      });
      return [];
    }
  }

  // Orders
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<string | null> {
    try {
      // This would typically be handled by a Cloud Function
      // For now, we'll just return a mock ID
      const orderId = `order_${Date.now()}`;
      return orderId;
    } catch (error) {
      console.error('🔥 [FirestoreService] Error creating order:', error);
      console.error('🔥 [FirestoreService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      return null;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      // This would typically query the orders collection
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('🔥 [FirestoreService] Error fetching user orders:', error);
      console.error('🔥 [FirestoreService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown',
        userId: userId
      });
      return [];
    }
  }

  // Collection Group Query Methods (for subcollection structure)
  // These methods assume you restructure your data to have meals as subcollections under restaurants
  
  /**
   * Get all menu items from all restaurants using collection group query
   * This requires menu items to be stored as subcollections under restaurants
   * Structure: restaurants/{restaurantId}/menus/{menuId}
   */
  async getAllMealsFromAllRestaurants(): Promise<Meal[]> {
    console.log('🔥 [FirestoreService] Starting collection group query for all menu items...');
    try {
      console.log('🔥 [FirestoreService] Building collection group query...');
      const q = query(
        collectionGroup(db, 'menus'), // This queries all 'menus' subcollections
        where('available', '==', true),
        orderBy('rating', 'desc'),
        limit(20)
      );
      
      console.log('🔥 [FirestoreService] Executing collection group query...');
      const snapshot = await getDocs(q);
      
      console.log(`🔥 [FirestoreService] Collection group query completed. Found ${snapshot.docs.length} meals`);
      console.log('🔥 [FirestoreService] Raw snapshot data:', snapshot.docs.map(doc => ({ 
        id: doc.id, 
        path: doc.ref.path,
        data: doc.data() 
      })));
      
      const meals = snapshot.docs.map(doc => this.mapMealData(doc));
      
      console.log('🔥 [FirestoreService] Processed meals from collection group:', meals);
      return meals;
    } catch (error) {
      console.error('🔥 [FirestoreService] Error in collection group query:', error);
      console.error('🔥 [FirestoreService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      return [];
    }
  }

  /**
   * Get menu items by category across all restaurants using collection group query
   */
  async getMealsByCategoryFromAllRestaurants(category: string): Promise<Meal[]> {
    console.log(`🔥 [FirestoreService] Starting collection group query for menu items in category: ${category}`);
    try {
      console.log('🔥 [FirestoreService] Building collection group query with category filter...');
      const q = query(
        collectionGroup(db, 'menus'),
        where('available', '==', true),
        where('category', '==', category),
        orderBy('rating', 'desc'),
        limit(20)
      );
      
      console.log('🔥 [FirestoreService] Executing collection group query...');
      const snapshot = await getDocs(q);
      
      console.log(`🔥 [FirestoreService] Collection group query completed. Found ${snapshot.docs.length} meals in category ${category}`);
      
      const meals = snapshot.docs.map(doc => this.mapMealData(doc));
      
      console.log('🔥 [FirestoreService] Processed meals from collection group:', meals);
      return meals;
    } catch (error) {
      console.error('🔥 [FirestoreService] Error in collection group query:', error);
      console.error('🔥 [FirestoreService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown',
        category: category
      });
      return [];
    }
  }
}

export default new FirestoreService();
