import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, StatusBar } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { View } from '@/components/Themed';
import StyledText from '@/components/StyledText';
import { useCart } from '@/components/CartContext';

const { width } = Dimensions.get('window');

// Dummy data for restaurants
const restaurants: Record<string, {
  id: string;
  name: string;
  location: string;
  image: any;
  rating: number;
  reviews: number;
  deliveryTime: string;
  description: string;
}> = {
  '1': {
    id: '1',
    name: 'Eni Stores',
    location: 'Nsikak Eduok',
    image: require('@/assets/images/laanieats-logo.png'),
    rating: 4.5,
    reviews: 1234,
    deliveryTime: '25-30 min',
    description: 'Authentic Nigerian cuisine with fresh ingredients and traditional recipes.'
  },
  '2': {
    id: '2',
    name: 'Kilimanjaro',
    location: 'Ikot Ekpene Road',
    image: require('@/assets/images/laanieats-logo.png'),
    rating: 4.3,
    reviews: 856,
    deliveryTime: '20-25 min',
    description: 'Modern African fusion restaurant serving contemporary dishes with local flavors.'
  },
  '3': {
    id: '3',
    name: 'Chicken Republic',
    location: 'Ikot Ekpene Road',
    image: require('@/assets/images/laanieats-logo.png'),
    rating: 4.7,
    reviews: 2103,
    deliveryTime: '15-20 min',
    description: 'Fast-casual dining specializing in grilled chicken and continental dishes.'
  },
  '4': {
    id: '4',
    name: 'Pizza Palace',
    location: 'Main Street',
    image: require('@/assets/images/laanieats-logo.png'),
    rating: 4.2,
    reviews: 567,
    deliveryTime: '30-35 min',
    description: 'Italian-inspired pizzeria with wood-fired ovens and fresh toppings.'
  }
};

// Dummy data for restaurant meals
const restaurantMeals: Record<string, Array<{
  id: string;
  name: string;
  description: string;
  price: string;
  image: any;
  category: string;
}>> = {
  '1': [ // Eni Stores meals
    {
      id: '1',
      name: 'Okro soup & Garri',
      description: 'Thick okro soup with fresh fish, served hot with smooth white garri.',
      price: '₦2,800',
      image: require('@/assets/images/laanieats-logo.png'),
      category: 'Soups'
    },
    {
      id: '2',
      name: 'Jollof Rice & Plantain',
      description: 'Naija-style jollof rice with crispy, golden plantain slices. Pure comfort food.',
      price: '₦2,200',
      image: require('@/assets/images/laanieats-logo.png'),
      category: 'Rice & Pasta'
    },
    {
      id: '3',
      name: 'Pepper Soup',
      description: 'Spicy Nigerian pepper soup with assorted meat and vegetables.',
      price: '₦1,800',
      image: require('@/assets/images/laanieats-logo.png'),
      category: 'Soups'
    },
    {
      id: '4',
      name: 'Pounded Yam & Efo Riro',
      description: 'Smooth pounded yam served with rich vegetable soup and choice meat.',
      price: '₦3,200',
      image: require('@/assets/images/laanieats-logo.png'),
      category: 'Soups'
    }
  ],
  '2': [ // Kilimanjaro meals
    {
      id: '5',
      name: 'Shawarma & Coke',
      description: 'Spicy beef or chicken shawarma wrapped fresh, served with ice-cold Coke.',
      price: '₦2,500',
      image: require('@/assets/images/laanieats-logo.png'),
      category: 'Snacks'
    },
    {
      id: '6',
      name: 'Grilled Fish & Chips',
      description: 'Fresh grilled fish with crispy chips and tartar sauce.',
      price: '₦3,500',
      image: require('@/assets/images/laanieats-logo.png'),
      category: 'Main Course'
    }
  ],
  '3': [ // Chicken Republic meals
    {
      id: '7',
      name: 'Chicken & Chips',
      description: 'Crispy fried chicken with golden fries and special sauce.',
      price: '₦3,000',
      image: require('@/assets/images/laanieats-logo.png'),
      category: 'Main Course'
    },
    {
      id: '8',
      name: 'Grilled Chicken Salad',
      description: 'Fresh mixed greens with grilled chicken breast and vinaigrette.',
      price: '₦2,800',
      image: require('@/assets/images/laanieats-logo.png'),
      category: 'Salads'
    }
  ],
  '4': [ // Pizza Palace meals
    {
      id: '9',
      name: 'Margherita Pizza',
      description: 'Classic tomato sauce with mozzarella cheese and fresh basil.',
      price: '₦4,500',
      image: require('@/assets/images/laanieats-logo.png'),
      category: 'Pizza'
    },
    {
      id: '10',
      name: 'Pepperoni Pizza',
      description: 'Spicy pepperoni with melted cheese on crispy crust.',
      price: '₦5,200',
      image: require('@/assets/images/laanieats-logo.png'),
      category: 'Pizza'
    }
  ]
};

const categories = ['All', 'Soups', 'Snacks', 'Rice & Pasta', 'Main Course', 'Salads', 'Pizza'];

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const restaurant = restaurants[id as string];
  const meals = restaurantMeals[id as string] || [];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addItem } = useCart();

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <StyledText>Restaurant not found</StyledText>
      </View>
    );
  }

  const filteredMeals = selectedCategory === 'All' 
    ? meals 
    : meals.filter(meal => meal.category === selectedCategory);

  const renderMealCard = ({ item }: { item: typeof meals[0] }) => (
    <TouchableOpacity 
      style={styles.mealCard}
      onPress={() => router.push(`/meal/${item.id}`)}
    >
      <Image source={item.image} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <StyledText variant="subtitle" weight="bold" style={styles.mealName}>
          {item.name}
        </StyledText>
        <StyledText variant="body" weight="regular" style={styles.mealDescription}>
          {item.description}
        </StyledText>
        <StyledText variant="body" weight="semibold" style={styles.mealPrice}>
          {item.price}
        </StyledText>
        <View style={styles.mealActions}>
          <TouchableOpacity 
            style={styles.orderNowButton}
            onPress={() => router.push(`/meal/${item.id}`)}
          >
            <StyledText variant="button" weight="semibold" style={styles.orderNowButtonText}>
              Order now
            </StyledText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => {
              addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                restaurant: restaurant.name,
                quantity: 1
              });
            }}
          >
            <StyledText variant="button" weight="semibold" style={styles.addToCartButtonText}>
              Add to Cart
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <StyledText 
        variant="body" 
        weight="medium"
        style={[
          styles.categoryButtonText,
          selectedCategory === item && styles.categoryButtonTextActive
        ]}
      >
        {item}
      </StyledText>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <StyledText variant="body" weight="semibold" style={styles.headerTitle}>
          {restaurant.name} - {restaurant.location}
        </StyledText>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Restaurant Image */}
      <Image source={restaurant.image} style={styles.restaurantImage} />

      {/* Restaurant Details */}
      <View style={styles.restaurantDetails}>
        <StyledText variant="title" weight="bold" style={styles.restaurantName}>
          {restaurant.name} - {restaurant.location}
        </StyledText>
        <View style={styles.restaurantStats}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <StyledText variant="body" weight="medium" style={styles.ratingText}>
              {restaurant.rating} ({restaurant.reviews} reviews)
            </StyledText>
          </View>
          <StyledText variant="body" weight="regular" style={styles.deliveryTime}>
            • {restaurant.deliveryTime}
          </StyledText>
        </View>
        <StyledText variant="body" weight="regular" style={styles.restaurantDescription}>
          {restaurant.description}
        </StyledText>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.messageButton}>
          <StyledText variant="button" weight="semibold" style={styles.messageButtonText}>
            Send message
          </StyledText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton}>
          <StyledText variant="button" weight="semibold" style={styles.callButtonText}>
            Call
          </StyledText>
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryButton}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Meals List */}
      <View style={styles.mealsContainer}>
        <FlatList
          data={filteredMeals}
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
    backgroundColor: '#ffffff',
    marginTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  restaurantDetails: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  restaurantStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  mealsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  mealImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  mealInfo: {
    justifyContent: 'space-between',
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  mealDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 12,
  },
  mealActions: {
    flexDirection: 'row',
    gap: 8,
  },
  orderNowButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
  },
  orderNowButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '600',
  },
});
