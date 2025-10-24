/**
 * Test script to demonstrate collection group queries vs regular queries
 * Run this with: npx ts-node scripts/testCollectionGroupQueries.ts
 */

import FirestoreService from '../services/firestoreService';

async function testCollectionGroupQueries() {
  console.log('🧪 [Test] Testing Collection Group Queries vs Regular Queries...');
  
  try {
    // Test 1: Regular query (current structure)
    console.log('\n📊 [Test] Testing regular query (current structure)...');
    const regularMeals = await FirestoreService.getTopMeals();
    console.log('📊 [Test] Regular query result:', regularMeals.length, 'meals');
    
    // Test 2: Collection group query (subcollection structure)
    console.log('\n📊 [Test] Testing collection group query (subcollection structure)...');
    const collectionGroupMeals = await FirestoreService.getAllMealsFromAllRestaurants();
    console.log('📊 [Test] Collection group query result:', collectionGroupMeals.length, 'meals');
    
    // Test 3: Collection group query by category
    console.log('\n📊 [Test] Testing collection group query by category...');
    const nigerianMeals = await FirestoreService.getMealsByCategoryFromAllRestaurants('Nigerian');
    console.log('📊 [Test] Nigerian meals from collection group:', nigerianMeals.length, 'meals');
    
    console.log('\n✅ [Test] All tests completed!');
    
  } catch (error) {
    console.error('❌ [Test] Test failed:', error);
  }
}

// Run the test
testCollectionGroupQueries();
