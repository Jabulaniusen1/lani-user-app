import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Text, View } from '@/components/Themed';
import { useCart } from '@/components/CartContext';

const { width } = Dimensions.get('window');

// Dummy data for restaurants
const popularRestaurants = [
  {
    id: '1',
    name: 'Eni Stores',
    location: 'Nsikak Eduok',
    image: require('@/assets/images/laanieats-logo.png'), // Using existing logo as placeholder
    rating: 4.5,
    reviews: 1234,
    deliveryTime: '25-30 min'
  },
  {
    id: '2',
    name: 'Kilimanjaro',
    location: 'Ikot Ekpene Road',
    image: require('@/assets/images/laanieats-logo.png'),
    rating: 4.3,
    reviews: 856,
    deliveryTime: '20-25 min'
  },
  {
    id: '3',
    name: 'Chicken Republic',
    location: 'Ikot Ekpene Road',
    image: require('@/assets/images/laanieats-logo.png'),
    rating: 4.7,
    reviews: 2103,
    deliveryTime: '15-20 min'
  },
  {
    id: '4',
    name: 'Pizza Palace',
    location: 'Main Street',
    image: require('@/assets/images/laanieats-logo.png'),
    rating: 4.2,
    reviews: 567,
    deliveryTime: '30-35 min'
  }
];

// Dummy data for top meals
const topMeals = [
  {
    id: '1',
    name: 'Shawarma & Coke',
    description: 'Spicy beef or chicken shawarma wrapped fresh, served with ice-cold Coke.',
    price: '₦2,500',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Kilimanjaro'
  },
  {
    id: '2',
    name: 'Jollof Rice & Plantain',
    description: 'Naija-style jollof rice with crispy, golden plantain slices. Pure comfort food.',
    price: '₦2,200',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Eni Stores'
  },
  {
    id: '3',
    name: 'Chicken & Chips',
    description: 'Crispy fried chicken with golden fries and special sauce.',
    price: '₦3,000',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Chicken Republic'
  },
  {
    id: '4',
    name: 'Pepper Soup',
    description: 'Spicy Nigerian pepper soup with assorted meat and vegetables.',
    price: '₦1,800',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Eni Stores'
  }
];

export default function HomeScreen() {
  const { addItem, state } = useCart();

  const renderRestaurantCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => router.push(`/restaurant/${item.id}`)}
    >
      <Image source={item.image} style={styles.restaurantImage} />
      <Text style={styles.restaurantName}>{item.name}</Text>
      <Text style={styles.restaurantLocation}>{item.location}</Text>
    </TouchableOpacity>
  );

  const renderMealCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.mealCard}
      onPress={() => router.push(`/meal/${item.id}`)}
    >
      <Image source={item.image} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealDescription}>{item.description}</Text>
        <Text style={styles.mealPrice}>{item.price}</Text>
        <View style={styles.mealActions}>
          <TouchableOpacity 
            style={styles.orderNowButton}
            onPress={() => router.push(`/meal/${item.id}`)}
          >
            <Text style={styles.orderNowButtonText}>Order now</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => {
              addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                restaurant: item.restaurant,
                quantity: 1
              });
            }}
          >
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome, Annie</Text>
          <View style={styles.locationSection}>
            <Ionicons name="location" size={16} color="#4CAF50" />
            <Text style={styles.locationText}>Ewet Housing Estate</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={require('@/assets/images/laanieats-logo.png')} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
          >
            <Ionicons name="cart" size={24} color="#333" />
            {state.totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{state.totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner Section */}
      <View style={styles.bannerSection}>
        <Image 
          source={require('@/assets/images/laanieats-logo.png')} 
          style={styles.bannerImage} 
        />
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerText}>What are you eating today?</Text>
        </View>
      </View>

      {/* Popular Restaurants Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Restaurants</Text>
          <View style={styles.navigationArrows}>
            <TouchableOpacity style={styles.arrowButton}>
              <Ionicons name="chevron-back" size={20} color="#CCC" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowButton}>
              <Ionicons name="chevron-forward" size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
        <FlatList
          data={popularRestaurants}
          renderItem={renderRestaurantCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.restaurantsList}
        />
      </View>

      {/* Top Meals Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Top Meals</Text>
        <FlatList
          data={topMeals}
          renderItem={renderMealCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  bannerTextContainer: {
    flex: 1,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  navigationArrows: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantsList: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  restaurantLocation: {
    fontSize: 14,
    color: '#666',
  },
  mealCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mealImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
    resizeMode: 'cover',
  },
  mealInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  mealPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 12,
  },
  mealActions: {
    flexDirection: 'row',
    gap: 12,
  },
  orderNowButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  orderNowButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
});
