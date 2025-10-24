/**
 * Test script to verify Firebase logging is working
 * Run this with: npx ts-node scripts/testFirebaseLogging.ts
 */

import FirestoreService from '../services/firestoreService';

async function testFirebaseLogging() {
  console.log('🧪 [Test] Starting Firebase logging test...');
  
  try {
    console.log('🧪 [Test] Testing getPopularRestaurants...');
    const restaurants = await FirestoreService.getPopularRestaurants();
    console.log('🧪 [Test] getPopularRestaurants result:', restaurants);
    
    console.log('🧪 [Test] Testing getTopMeals...');
    const meals = await FirestoreService.getTopMeals();
    console.log('🧪 [Test] getTopMeals result:', meals);
    
    console.log('🧪 [Test] Testing getAllRestaurants...');
    const allRestaurants = await FirestoreService.getAllRestaurants();
    console.log('🧪 [Test] getAllRestaurants result:', allRestaurants);
    
    console.log('🧪 [Test] All tests completed successfully!');
  } catch (error) {
    console.error('🧪 [Test] Test failed with error:', error);
  }
}

// Run the test
testFirebaseLogging();
