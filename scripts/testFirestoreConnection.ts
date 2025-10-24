/**
 * Test script to check Firestore connection and collections
 * Run this with: npx ts-node scripts/testFirestoreConnection.ts
 */

import { db } from '../auth/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

async function testFirestoreConnection() {
  console.log('🧪 [Test] Testing Firestore connection...');
  
  try {
    // Test 1: Try to access the restaurants collection
    console.log('🧪 [Test] Testing restaurants collection...');
    const restaurantsRef = collection(db, 'restaurants');
    const restaurantsSnapshot = await getDocs(restaurantsRef);
    console.log('🧪 [Test] Restaurants collection accessible. Document count:', restaurantsSnapshot.docs.length);
    
    // Test 2: Try to access the meals collection
    console.log('🧪 [Test] Testing meals collection...');
    const mealsRef = collection(db, 'meals');
    const mealsSnapshot = await getDocs(mealsRef);
    console.log('🧪 [Test] Meals collection accessible. Document count:', mealsSnapshot.docs.length);
    
    // Test 3: Try to access a specific document
    console.log('🧪 [Test] Testing document access...');
    const testDocRef = doc(db, 'restaurants', 'test');
    const testDoc = await getDoc(testDocRef);
    console.log('🧪 [Test] Document access test completed. Document exists:', testDoc.exists());
    
    console.log('🧪 [Test] All Firestore tests passed!');
    
  } catch (error) {
    console.error('🧪 [Test] Firestore test failed:', error);
    console.error('🧪 [Test] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

// Run the test
testFirestoreConnection();
