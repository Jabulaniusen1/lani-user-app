import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  orderBy, 
  limit,
  where,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../auth/firebase';

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  description?: string;
  isOpen: boolean;
  category: string;
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
  // Restaurants
  async getPopularRestaurants(): Promise<Restaurant[]> {
    try {
      const q = query(
        collection(db, 'restaurants'),
        where('isOpen', '==', true),
        orderBy('rating', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Restaurant));
    } catch (error) {
      console.error('Error fetching popular restaurants:', error);
      return [];
    }
  }

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      const docRef = doc(db, 'restaurants', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Restaurant;
      }
      return null;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      return null;
    }
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    try {
      const q = query(
        collection(db, 'restaurants'),
        where('isOpen', '==', true),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Restaurant));
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  }

  // Meals
  async getTopMeals(): Promise<Meal[]> {
    try {
      const q = query(
        collection(db, 'meals'),
        where('isAvailable', '==', true),
        orderBy('rating', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Meal));
    } catch (error) {
      console.error('Error fetching top meals:', error);
      return [];
    }
  }

  async getMealById(id: string): Promise<Meal | null> {
    try {
      const docRef = doc(db, 'meals', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Meal;
      }
      return null;
    } catch (error) {
      console.error('Error fetching meal:', error);
      return null;
    }
  }

  async getMealsByRestaurant(restaurantId: string): Promise<Meal[]> {
    try {
      const q = query(
        collection(db, 'meals'),
        where('restaurantId', '==', restaurantId),
        where('isAvailable', '==', true),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Meal));
    } catch (error) {
      console.error('Error fetching restaurant meals:', error);
      return [];
    }
  }

  async searchMeals(searchTerm: string): Promise<Meal[]> {
    try {
      const q = query(
        collection(db, 'meals'),
        where('isAvailable', '==', true),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      const allMeals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Meal));
      
      // Filter by search term (case-insensitive)
      return allMeals.filter(meal => 
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching meals:', error);
      return [];
    }
  }

  // Orders
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<string | null> {
    try {
      // This would typically be handled by a Cloud Function
      // For now, we'll just return a mock ID
      const orderId = `order_${Date.now()}`;
      console.log('Order created:', orderId);
      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      // This would typically query the orders collection
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }
}

export default new FirestoreService();
