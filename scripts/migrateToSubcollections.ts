/**
 * Migration script to restructure data for collection group queries
 * This script moves meals from a top-level collection to subcollections under restaurants
 * 
 * BEFORE: 
 *   restaurants/{id}
 *   meals/{id} (with restaurantId field)
 * 
 * AFTER:
 *   restaurants/{id}/meals/{mealId}
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCqAKAzthfxkTxuzwhMU2LjUJRKn_MoDHY",
  authDomain: "my-client-projects-c311c.firebaseapp.com",
  projectId: "my-client-projects-c311c",
  storageBucket: "my-client-projects-c311c.firebasestorage.app",
  messagingSenderId: "819119575672",
  appId: "1:819119575672:web:f0895157cfc1874601d38d",
  measurementId: "G-1G93JJ0B76"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

async function migrateToSubcollections() {
  console.log('🔄 [Migration] Starting data migration to subcollections...');
  
  try {
    // Step 1: Get all restaurants
    console.log('🔄 [Migration] Fetching all restaurants...');
    const restaurantsSnapshot = await getDocs(collection(db, 'restaurants'));
    const restaurants = restaurantsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`🔄 [Migration] Found ${restaurants.length} restaurants`);
    
    // Step 2: Get all meals
    console.log('🔄 [Migration] Fetching all meals...');
    const mealsSnapshot = await getDocs(collection(db, 'meals'));
    const meals = mealsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`🔄 [Migration] Found ${meals.length} meals`);
    
    // Step 3: Create a map of restaurant names to IDs
    const restaurantMap = new Map();
    restaurants.forEach(restaurant => {
      restaurantMap.set(restaurant.name, restaurant.id);
    });
    
    // Step 4: Group meals by restaurant
    const mealsByRestaurant = new Map();
    meals.forEach(meal => {
      const restaurantId = restaurantMap.get(meal.restaurantName);
      if (restaurantId) {
        if (!mealsByRestaurant.has(restaurantId)) {
          mealsByRestaurant.set(restaurantId, []);
        }
        mealsByRestaurant.get(restaurantId).push(meal);
      } else {
        console.warn(`⚠️ [Migration] Restaurant not found for meal: ${meal.name} (${meal.restaurantName})`);
      }
    });
    
    // Step 5: Move meals to subcollections
    console.log('🔄 [Migration] Moving meals to subcollections...');
    let movedCount = 0;
    
    for (const [restaurantId, restaurantMeals] of mealsByRestaurant) {
      console.log(`🔄 [Migration] Processing ${restaurantMeals.length} meals for restaurant ${restaurantId}`);
      
      for (const meal of restaurantMeals) {
        try {
          // Add meal to restaurant's meals subcollection
          const mealData = {
            name: meal.name,
            description: meal.description,
            price: meal.price,
            image: meal.image,
            category: meal.category,
            isAvailable: meal.isAvailable,
            preparationTime: meal.preparationTime,
            rating: meal.rating,
            reviews: meal.reviews,
            restaurantName: meal.restaurantName
          };
          
          await addDoc(collection(db, 'restaurants', restaurantId, 'meals'), mealData);
          movedCount++;
          
          console.log(`✅ [Migration] Moved meal: ${meal.name} to restaurant ${restaurantId}`);
        } catch (error) {
          console.error(`❌ [Migration] Failed to move meal ${meal.name}:`, error);
        }
      }
    }
    
    console.log(`🔄 [Migration] Migration completed! Moved ${movedCount} meals to subcollections`);
    
    // Step 6: Optional - Delete original meals collection
    console.log('🔄 [Migration] Do you want to delete the original meals collection? (This is commented out for safety)');
    // Uncomment the following lines if you want to delete the original meals collection
    /*
    console.log('🔄 [Migration] Deleting original meals collection...');
    for (const meal of meals) {
      try {
        await deleteDoc(doc(db, 'meals', meal.id));
        console.log(`🗑️ [Migration] Deleted original meal: ${meal.name}`);
      } catch (error) {
        console.error(`❌ [Migration] Failed to delete meal ${meal.name}:`, error);
      }
    }
    */
    
  } catch (error) {
    console.error('❌ [Migration] Migration failed:', error);
  }
}

// Run the migration
migrateToSubcollections();
