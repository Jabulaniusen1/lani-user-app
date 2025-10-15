// This script can be run to seed your Firestore database with sample data
// Run this in a Node.js environment or as a Cloud Function

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCqAKAzthfxkTxuzwhMU2LjUJRKn_MoDHY",
  authDomain: "my-client-projects-c311c.firebaseapp.com",
  projectId: "my-client-projects-c311c",
  storageBucket: "my-client-projects-c311c.firebasestorage.app",
  messagingSenderId: "819119575672",
  appId: "1:819119575672:web:f0895157cfc1874601d38d",
  measurementId: "G-1G93JJ0B76"
};


// Initialize Firebase app only if it doesn't already exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const sampleRestaurants = [
  {
    name: "Eni Stores",
    location: "Nsikak Eduok",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    rating: 4.5,
    reviews: 1234,
    deliveryTime: "25-30 min",
    description: "Authentic Nigerian cuisine with fresh ingredients",
    isOpen: true,
    category: "Nigerian"
  },
  {
    name: "Kilimanjaro",
    location: "Ikot Ekpene Road",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    rating: 4.3,
    reviews: 856,
    deliveryTime: "20-25 min",
    description: "Fast food and snacks",
    isOpen: true,
    category: "Fast Food"
  },
  {
    name: "Chicken Republic",
    location: "Ikot Ekpene Road",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400",
    rating: 4.7,
    reviews: 2103,
    deliveryTime: "15-20 min",
    description: "Grilled chicken and sides",
    isOpen: true,
    category: "Grill"
  },
  {
    name: "Pizza Palace",
    location: "Main Street",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    rating: 4.2,
    reviews: 567,
    deliveryTime: "30-35 min",
    description: "Fresh pizza and Italian cuisine",
    isOpen: true,
    category: "Italian"
  }
];

const sampleMeals = [
  {
    name: "Shawarma & Coke",
    description: "Spicy beef or chicken shawarma wrapped fresh, served with ice-cold Coke.",
    price: 2500,
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400",
    restaurantId: "", // Will be filled after restaurants are created
    restaurantName: "Kilimanjaro",
    category: "Fast Food",
    isAvailable: true,
    preparationTime: 15,
    rating: 4.5,
    reviews: 234
  },
  {
    name: "Jollof Rice & Plantain",
    description: "Naija-style jollof rice with crispy, golden plantain slices. Pure comfort food.",
    price: 2200,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    restaurantId: "", // Will be filled after restaurants are created
    restaurantName: "Eni Stores",
    category: "Nigerian",
    isAvailable: true,
    preparationTime: 25,
    rating: 4.8,
    reviews: 456
  },
  {
    name: "Chicken & Chips",
    description: "Crispy fried chicken with golden fries and special sauce.",
    price: 3000,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400",
    restaurantId: "", // Will be filled after restaurants are created
    restaurantName: "Chicken Republic",
    category: "Grill",
    isAvailable: true,
    preparationTime: 20,
    rating: 4.6,
    reviews: 789
  },
  {
    name: "Okro Soup & Garri",
    description: "Spicy Nigerian okro soup with assorted meat and vegetables, served with garri.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    restaurantId: "", // Will be filled after restaurants are created
    restaurantName: "Eni Stores",
    category: "Nigerian",
    isAvailable: true,
    preparationTime: 30,
    rating: 4.7,
    reviews: 123
  },
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil.",
    price: 3500,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    restaurantId: "", // Will be filled after restaurants are created
    restaurantName: "Pizza Palace",
    category: "Italian",
    isAvailable: true,
    preparationTime: 25,
    rating: 4.4,
    reviews: 345
  },
  {
    name: "Pepperoni Pizza",
    description: "Spicy pepperoni pizza with melted cheese and tomato sauce.",
    price: 3800,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
    restaurantId: "", // Will be filled after restaurants are created
    restaurantName: "Pizza Palace",
    category: "Italian",
    isAvailable: true,
    preparationTime: 25,
    rating: 4.3,
    reviews: 278
  }
];

async function seedData() {
  try {
    console.log('Starting to seed data...');
    
    // Add restaurants
    const restaurantIds: { [key: string]: string } = {};
    for (const restaurant of sampleRestaurants) {
      const docRef = await addDoc(collection(db, 'restaurants'), restaurant);
      restaurantIds[restaurant.name] = docRef.id;
      console.log(`Added restaurant: ${restaurant.name} with ID: ${docRef.id}`);
    }
    
    // Add meals with correct restaurant IDs
    for (const meal of sampleMeals) {
      const mealData = {
        ...meal,
        restaurantId: restaurantIds[meal.restaurantName]
      };
      const docRef = await addDoc(collection(db, 'meals'), mealData);
      console.log(`Added meal: ${meal.name} with ID: ${docRef.id}`);
    }
    
    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Uncomment the line below to run the seeding function
// seedData();

export { seedData };
