import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { View } from '@/components/Themed';
import StyledText from '@/components/StyledText';
import { useCart } from '@/components/CartContext';

const { width } = Dimensions.get('window');

// Dummy data for meals
const meals: Record<string, {
  id: string;
  name: string;
  description: string;
  price: string;
  image: any;
  restaurant: string;
  ingredients: string;
  allergens: string;
  category: string;
  preparationTime: string;
  spiceLevel: string;
}> = {
  '1': {
    id: '1',
    name: 'Okro soup & Garri',
    description: 'Thick okro soup with fresh fish, served hot with smooth white garri.',
    price: '₦2,800',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Eni Stores',
    ingredients: 'Okro, fresh fish, palm oil, crayfish, stockfish, periwinkle, seasoning cubes, uziza leaves, pepper, salt',
    allergens: 'Contains seafood (fish, crayfish, periwinkle) and palm oil',
    category: 'Soups',
    preparationTime: '15-20 min',
    spiceLevel: 'Medium'
  },
  '2': {
    id: '2',
    name: 'Jollof Rice & Plantain',
    description: 'Naija-style jollof rice with crispy, golden plantain slices. Pure comfort food.',
    price: '₦2,200',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Eni Stores',
    ingredients: 'Rice, tomatoes, red bell peppers, onions, scotch bonnet peppers, palm oil, curry powder, thyme, bay leaves, plantains, vegetable oil, salt',
    allergens: 'Contains palm oil',
    category: 'Rice & Pasta',
    preparationTime: '25-30 min',
    spiceLevel: 'Medium'
  },
  '3': {
    id: '3',
    name: 'Pepper Soup',
    description: 'Spicy Nigerian pepper soup with assorted meat and vegetables.',
    price: '₦1,800',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Eni Stores',
    ingredients: 'Assorted meat (goat, beef, or fish), scotch bonnet peppers, uziza leaves, calabash nutmeg, alligator pepper, onions, garlic, ginger, stock cubes, salt',
    allergens: 'Contains meat and spices',
    category: 'Soups',
    preparationTime: '20-25 min',
    spiceLevel: 'High'
  },
  '4': {
    id: '4',
    name: 'Pounded Yam & Efo Riro',
    description: 'Smooth pounded yam served with rich vegetable soup and choice meat.',
    price: '₦3,200',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Eni Stores',
    ingredients: 'Yam, spinach, tomatoes, red bell peppers, palm oil, meat (beef, goat, or fish), locust beans, stock cubes, salt, pepper',
    allergens: 'Contains palm oil and meat',
    category: 'Soups',
    preparationTime: '30-35 min',
    spiceLevel: 'Medium'
  },
  '5': {
    id: '5',
    name: 'Shawarma & Coke',
    description: 'Spicy beef or chicken shawarma wrapped fresh, served with ice-cold Coke.',
    price: '₦2,500',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Kilimanjaro',
    ingredients: 'Flatbread, marinated chicken or beef, lettuce, tomatoes, onions, garlic sauce, mayonnaise, pickles, Coca-Cola',
    allergens: 'Contains wheat, dairy, and may contain nuts',
    category: 'Snacks',
    preparationTime: '10-15 min',
    spiceLevel: 'Medium'
  },
  '6': {
    id: '6',
    name: 'Grilled Fish & Chips',
    description: 'Fresh grilled fish with crispy chips and tartar sauce.',
    price: '₦3,500',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Kilimanjaro',
    ingredients: 'Fresh fish fillet, potatoes, olive oil, herbs, lemon, tartar sauce, salt, pepper',
    allergens: 'Contains fish and may contain gluten',
    category: 'Main Course',
    preparationTime: '20-25 min',
    spiceLevel: 'Low'
  },
  '7': {
    id: '7',
    name: 'Chicken & Chips',
    description: 'Crispy fried chicken with golden fries and special sauce.',
    price: '₦3,000',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Chicken Republic',
    ingredients: 'Chicken pieces, flour, breadcrumbs, eggs, potatoes, vegetable oil, herbs, spices, special sauce, salt',
    allergens: 'Contains wheat, eggs, and may contain dairy',
    category: 'Main Course',
    preparationTime: '15-20 min',
    spiceLevel: 'Low'
  },
  '8': {
    id: '8',
    name: 'Grilled Chicken Salad',
    description: 'Fresh mixed greens with grilled chicken breast and vinaigrette.',
    price: '₦2,800',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Chicken Republic',
    ingredients: 'Mixed salad greens, grilled chicken breast, cherry tomatoes, cucumbers, red onions, olive oil, balsamic vinegar, herbs, salt, pepper',
    allergens: 'Contains chicken',
    category: 'Salads',
    preparationTime: '12-15 min',
    spiceLevel: 'Low'
  },
  '9': {
    id: '9',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce with mozzarella cheese and fresh basil.',
    price: '₦4,500',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Pizza Palace',
    ingredients: 'Pizza dough, tomato sauce, mozzarella cheese, fresh basil, olive oil, salt, pepper',
    allergens: 'Contains wheat and dairy',
    category: 'Pizza',
    preparationTime: '18-22 min',
    spiceLevel: 'Low'
  },
  '10': {
    id: '10',
    name: 'Pepperoni Pizza',
    description: 'Spicy pepperoni with melted cheese on crispy crust.',
    price: '₦5,200',
    image: require('@/assets/images/laanieats-logo.png'),
    restaurant: 'Pizza Palace',
    ingredients: 'Pizza dough, tomato sauce, mozzarella cheese, pepperoni, olive oil, salt, pepper',
    allergens: 'Contains wheat, dairy, and pork',
    category: 'Pizza',
    preparationTime: '18-22 min',
    spiceLevel: 'Medium'
  }
};

export default function MealScreen() {
  const { id } = useLocalSearchParams();
  const meal = meals[id as string];
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  if (!meal) {
    return (
      <View style={styles.container}>
        <StyledText>Meal not found</StyledText>
      </View>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      image: meal.image,
      restaurant: meal.restaurant,
      quantity: quantity
    });
  };

  const handleOrderNow = () => {
    // Order now functionality
    console.log('Ordering now:', meal.name, 'Quantity:', quantity);
    // You can implement actual ordering logic here
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

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
          {meal.restaurant}
        </StyledText>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Meal Image */}
      <Image source={meal.image} style={styles.mealImage} />

      {/* Meal Details Card */}
      <View style={styles.mealDetailsCard}>
        {/* Quantity and Price Row */}
        <View style={styles.quantityPriceRow}>
          <View style={styles.quantitySelector}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={decreaseQuantity}
            >
              <Ionicons name="remove" size={20} color="#ffffff" />
            </TouchableOpacity>
            <StyledText variant="body" weight="semibold" style={styles.quantityText}>
              {quantity}
            </StyledText>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={increaseQuantity}
            >
              <Ionicons name="add" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <StyledText variant="title" weight="bold" style={styles.mealPrice}>
            {meal.price}
          </StyledText>
        </View>

        {/* Meal Name */}
        <StyledText variant="title" weight="bold" style={styles.mealName}>
          {meal.name}
        </StyledText>

        {/* Meal Description */}
        <StyledText variant="body" weight="regular" style={styles.mealDescription}>
          {meal.description}
        </StyledText>

        {/* Meal Info Grid */}
        <View style={styles.mealInfoGrid}>
          <View style={styles.infoItem}>
            <StyledText variant="caption" weight="medium" style={styles.infoLabel}>
              Category
            </StyledText>
            <StyledText variant="body" weight="semibold" style={styles.infoValue}>
              {meal.category}
            </StyledText>
          </View>
          <View style={styles.infoItem}>
            <StyledText variant="caption" weight="medium" style={styles.infoLabel}>
              Prep Time
            </StyledText>
            <StyledText variant="body" weight="semibold" style={styles.infoValue}>
              {meal.preparationTime}
            </StyledText>
          </View>
          <View style={styles.infoItem}>
            <StyledText variant="caption" weight="medium" style={styles.infoLabel}>
              Spice Level
            </StyledText>
            <StyledText variant="body" weight="semibold" style={styles.infoValue}>
              {meal.spiceLevel}
            </StyledText>
          </View>
        </View>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <StyledText variant="subtitle" weight="bold" style={styles.sectionTitle}>
            Ingredients:
          </StyledText>
          <StyledText variant="body" weight="regular" style={styles.sectionContent}>
            {meal.ingredients}
          </StyledText>
        </View>

        {/* Allergen Info Section */}
        <View style={styles.section}>
          <StyledText variant="subtitle" weight="bold" style={styles.sectionTitle}>
            Allergen Info:
          </StyledText>
          <StyledText variant="body" weight="regular" style={styles.sectionContent}>
            {meal.allergens}
          </StyledText>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.orderNowButton}
            onPress={handleOrderNow}
          >
            <StyledText variant="button" weight="semibold" style={styles.orderNowButtonText}>
              Order now
            </StyledText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <StyledText variant="button" weight="semibold" style={styles.addToCartButtonText}>
              Add to Cart
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff1e8',
    marginTop: 50,
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
  mealImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  mealDetailsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  quantityPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  mealPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  mealInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  orderNowButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 10,
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
    paddingVertical: 14,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
});
