/**
 * Debug script to inspect your actual database structure
 * Run this with: npx ts-node scripts/debugDatabase.ts
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

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

async function debugDatabase() {
  console.log('🔍 [Debug] Starting database inspection...');
  
  try {
    // Check restaurants collection
    console.log('\n📊 [Debug] Checking restaurants collection...');
    const restaurantsSnapshot = await getDocs(collection(db, 'restaurants'));
    console.log(`📊 [Debug] Found ${restaurantsSnapshot.docs.length} restaurants`);
    
    if (restaurantsSnapshot.docs.length > 0) {
      console.log('📊 [Debug] Restaurant data:');
      restaurantsSnapshot.docs.forEach((doc, index) => {
        console.log(`  Restaurant ${index + 1}:`, {
          id: doc.id,
          data: doc.data()
        });
        
        // Check if this restaurant has menus subcollection
        console.log(`  📋 [Debug] Checking menus subcollection for restaurant ${doc.id}...`);
        getDocs(collection(db, 'restaurants', doc.id, 'menus'))
          .then(menusSnapshot => {
            console.log(`  📋 [Debug] Found ${menusSnapshot.docs.length} menu items for restaurant ${doc.id}`);
            if (menusSnapshot.docs.length > 0) {
              menusSnapshot.docs.forEach((menuDoc, menuIndex) => {
                console.log(`    Menu item ${menuIndex + 1}:`, {
                  id: menuDoc.id,
                  data: menuDoc.data()
                });
              });
            }
          })
          .catch(error => {
            console.log(`  📋 [Debug] Error checking menus for restaurant ${doc.id}:`, error instanceof Error ? error.message : 'Unknown error');
          });
      });
    } else {
      console.log('📊 [Debug] No restaurants found in the database');
    }
    
    // Check if there's a top-level meals collection
    console.log('\n🍽️ [Debug] Checking for top-level meals collection...');
    try {
      const mealsSnapshot = await getDocs(collection(db, 'meals'));
      console.log(`🍽️ [Debug] Found ${mealsSnapshot.docs.length} meals in top-level collection`);
      if (mealsSnapshot.docs.length > 0) {
        mealsSnapshot.docs.forEach((doc, index) => {
          console.log(`  Meal ${index + 1}:`, {
            id: doc.id,
            data: doc.data()
          });
        });
      }
    } catch (error) {
      console.log('🍽️ [Debug] No top-level meals collection found:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Check all collections
    console.log('\n📁 [Debug] Checking all collections...');
    try {
      // This is a bit of a hack, but let's try to see what collections exist
      const testCollections = ['restaurants', 'meals', 'menus', 'orders', 'users'];
      for (const collectionName of testCollections) {
        try {
          const snapshot = await getDocs(collection(db, collectionName));
          console.log(`📁 [Debug] Collection '${collectionName}': ${snapshot.docs.length} documents`);
        } catch (error) {
          console.log(`📁 [Debug] Collection '${collectionName}': Does not exist or no access`);
        }
      }
    } catch (error) {
      console.log('📁 [Debug] Error checking collections:', error instanceof Error ? error.message : 'Unknown error');
    }
    
  } catch (error) {
    console.error('❌ [Debug] Database inspection failed:', error);
  }
}

// Run the debug
debugDatabase();
