import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/components/CartContext';
import FirestoreService, { Meal } from '@/services/firestoreService';

const { width, height } = Dimensions.get('window');

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const { state, addItem, removeItem } = useCart();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMealData();
  }, [id]);

  const fetchMealData = async () => {
    if (!id) return;
    
    console.log(`🍽️ [MealDetail] Fetching meal data for ID: ${id}`);
    setLoading(true);
    setError(null);

    try {
      console.log('🍽️ [MealDetail] Fetching meal details...');
      const mealData = await FirestoreService.getMealById(id);
      
      if (mealData) {
        console.log('🍽️ [MealDetail] Meal data received:', mealData);
        console.log('🍽️ [MealDetail] Meal image URL:', mealData.image);
        console.log('🍽️ [MealDetail] Meal price:', mealData.price);
        setMeal(mealData);
      } else {
        console.log('🍽️ [MealDetail] Meal not found');
        setError('Meal not found');
      }

    } catch (err) {
      console.error('🍽️ [MealDetail] Error fetching meal data:', err);
      setError('Failed to load meal details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!meal) return;
    
    console.log('🛒 [MealDetail] Adding to cart:', meal.name);
    addItem({
      id: meal.id,
      name: meal.name,
      price: `₦${meal.price.toLocaleString()}`,
      image: meal.image,
      restaurant: meal.restaurantName || 'Unknown Restaurant',
      quantity: 1
    });
    
    Alert.alert('Added to Cart', `${meal.name} has been added to your cart!`);
  };

  const handleRemoveFromCart = () => {
    if (!meal) return;
    
    console.log('🛒 [MealDetail] Removing from cart:', meal.name);
    removeItem(meal.id);
    
    Alert.alert('Removed from Cart', `${meal.name} has been removed from your cart!`);
  };

  const getQuantityInCart = () => {
    if (!meal) return 0;
    const cartItem = state.items.find(cartItem => cartItem.id === meal.id);
    return cartItem?.quantity || 0;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar backgroundColor={colors.background} barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading meal...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !meal) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar backgroundColor={colors.background} barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.textSecondary} />
          <Text style={[styles.errorText, { color: colors.text }]}>{error || 'Meal not found'}</Text>
          <Pressable
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: colors.buttonText }]}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const quantityInCart = getQuantityInCart();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.background} barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Meal Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Meal Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: meal.image }} 
            style={styles.mealImage}
            resizeMode="cover"
          />
        </View>

        {/* Meal Info */}
        <View style={[styles.mealInfo, { backgroundColor: colors.card }]}>
          <Text style={[styles.mealName, { color: colors.text }]}>{meal.name}</Text>
          
          {/* Price */}
          <Text style={[styles.mealPrice, { color: colors.price }]}>
            ₦{meal.price.toLocaleString()}
          </Text>

          {/* Category */}
          <View style={styles.categoryContainer}>
            <Ionicons name="restaurant" size={20} color={colors.primary} />
            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
              {meal.category}
            </Text>
          </View>

          {/* Preparation Time */}
          <View style={styles.prepTimeContainer}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <Text style={[styles.prepTimeText, { color: colors.textSecondary }]}>
              {meal.prepTime || meal.preparationTime} minutes
            </Text>
          </View>

          {/* Description */}
          {meal.description && meal.description.trim() !== '' && (
            <View style={styles.descriptionContainer}>
              <Text style={[styles.descriptionTitle, { color: colors.text }]}>Description</Text>
              <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
                {meal.description}
              </Text>
            </View>
          )}

          {/* Availability */}
          <View style={styles.availabilityContainer}>
            <View style={[
              styles.availabilityIndicator, 
              { backgroundColor: meal.available ? '#4CAF50' : '#F44336' }
            ]} />
            <Text style={[styles.availabilityText, { color: colors.text }]}>
              {meal.available ? 'Available' : 'Not Available'}
            </Text>
          </View>
        </View>

        {/* Cart Actions */}
        <View style={styles.cartSection}>
          {quantityInCart > 0 ? (
            <View style={styles.cartControls}>
              <Pressable
                style={[styles.cartButton, styles.removeButton, { borderColor: colors.primary }]}
                onPress={handleRemoveFromCart}
              >
                <Ionicons name="remove" size={20} color={colors.primary} />
                <Text style={[styles.cartButtonText, { color: colors.primary }]}>Remove</Text>
              </Pressable>
              
              <View style={[styles.quantityDisplay, { backgroundColor: colors.primary }]}>
                <Text style={[styles.quantityText, { color: colors.buttonText }]}>
                  {quantityInCart}
                </Text>
              </View>
              
              <Pressable
                style={[styles.cartButton, styles.addButton, { backgroundColor: colors.primary }]}
                onPress={handleAddToCart}
              >
                <Ionicons name="add" size={20} color={colors.buttonText} />
                <Text style={[styles.cartButtonText, { color: colors.buttonText }]}>Add</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
              onPress={handleAddToCart}
              disabled={!meal.available}
            >
              <Ionicons name="cart" size={24} color={colors.buttonText} />
              <Text style={[styles.addToCartText, { color: colors.buttonText }]}>
                Add to Cart
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  imageContainer: {
    height: 300,
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  mealInfo: {
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mealName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mealPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    marginLeft: 8,
  },
  prepTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  prepTimeText: {
    fontSize: 16,
    marginLeft: 8,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cartSection: {
    padding: 16,
  },
  cartControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  removeButton: {
    backgroundColor: 'transparent',
  },
  addButton: {
    borderWidth: 0,
  },
  cartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  quantityDisplay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addToCartText: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});