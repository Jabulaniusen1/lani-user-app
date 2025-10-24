/**
 * Test script to verify the updated FirestoreService with consistent error handling
 * Run this with: npx ts-node scripts/testUpdatedService.ts
 */

import FirestoreService from '../services/firestoreService';

async function testUpdatedService() {
  console.log('🧪 [Test] Testing updated FirestoreService with consistent error handling...');
  
  try {
    console.log('\n📊 [Test] Testing getPopularRestaurants...');
    const restaurants = await FirestoreService.getPopularRestaurants();
    console.log('📊 [Test] getPopularRestaurants result:', restaurants.length, 'restaurants');
    
    console.log('\n📊 [Test] Testing getTopMeals...');
    const meals = await FirestoreService.getTopMeals();
    console.log('📊 [Test] getTopMeals result:', meals.length, 'meals');
    
    console.log('\n📊 [Test] Testing getAllRestaurants...');
    const allRestaurants = await FirestoreService.getAllRestaurants();
    console.log('📊 [Test] getAllRestaurants result:', allRestaurants.length, 'restaurants');
    
    console.log('\n📊 [Test] Testing collection group queries...');
    const collectionGroupMeals = await FirestoreService.getAllMealsFromAllRestaurants();
    console.log('📊 [Test] getAllMealsFromAllRestaurants result:', collectionGroupMeals.length, 'meals');
    
    console.log('\n✅ [Test] All tests completed successfully!');
    console.log('🔥 [Test] Check the logs above for detailed Firebase operation logging');
    
  } catch (error) {
    console.error('❌ [Test] Test failed with error:', error);
  }
}

// Run the test
testUpdatedService();
