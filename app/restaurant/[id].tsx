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
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/components/CartContext';
import FirestoreService, { Restaurant, Meal } from '@/services/firestoreService';

const { width, height } = Dimensions.get('window');

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const { state, addItem, removeItem } = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    if (!id) return;
    
    console.log(`🏪 [RestaurantDetail] Fetching restaurant data for ID: ${id}`);
    setLoading(true);
    setError(null);

    try {
      // Fetch restaurant details
      console.log('🏪 [RestaurantDetail] Fetching restaurant details...');
      const restaurantData = await FirestoreService.getRestaurantById(id);
      
      if (restaurantData) {
        console.log('🏪 [RestaurantDetail] Restaurant data received:', restaurantData);
        console.log('🏪 [RestaurantDetail] Cover image URL:', restaurantData.coverImage);
        console.log('🏪 [RestaurantDetail] Logo URL:', restaurantData.logo);
        console.log('🏪 [RestaurantDetail] Address:', restaurantData.address);
        setRestaurant(restaurantData);
      } else {
        console.log('🏪 [RestaurantDetail] Restaurant not found');
        setError('Restaurant not found');
      }

      // Fetch restaurant meals
      console.log('🏪 [RestaurantDetail] Fetching restaurant meals...');
      const mealsData = await FirestoreService.getMealsByRestaurant(id);
      console.log(`🏪 [RestaurantDetail] Found ${mealsData.length} meals for restaurant`);
      setMeals(mealsData);

    } catch (err) {
      console.error('🏪 [RestaurantDetail] Error fetching restaurant data:', err);
      setError('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const renderMealItem = ({ item }: { item: Meal }) => {
    const cartItem = state.items.find(cartItem => cartItem.id === item.id);
    const quantityInCart = cartItem?.quantity || 0;
    
    const handleAddToCart = () => {
      addItem({
        id: item.id,
        name: item.name,
        price: `₦${item.price.toLocaleString()}`,
        image: item.image,
        restaurant: restaurant?.name || 'Unknown Restaurant',
        quantity: 1
      });
    };

    const handleRemoveFromCart = () => {
      removeItem(item.id);
    };

    return (
      <Pressable
        style={[styles.mealItem, { backgroundColor: colors.card }]}
        onPress={() => router.push(`/meal/${item.id}`)}
      >
        <Image source={{ uri: item.image }} style={styles.mealItemImage} />
        <View style={styles.mealItemInfo}>
          <Text style={[styles.mealItemName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.mealItemDescription, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.description && item.description.trim() !== '' ? item.description : 'No description available'}
          </Text>
          <Text style={[styles.mealItemPrice, { color: colors.price }]}>
            ₦{item.price.toLocaleString()}
          </Text>
        </View>
        
        {/* Cart Controls */}
        <View style={styles.mealItemActions}>
          {quantityInCart > 0 ? (
            <View style={styles.cartControls}>
              <Pressable
                style={[styles.cartButton, styles.removeButton, { borderColor: colors.primary }]}
                onPress={handleRemoveFromCart}
              >
                <Ionicons name="remove" size={16} color={colors.primary} />
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
                <Ionicons name="add" size={16} color={colors.buttonText} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
              onPress={handleAddToCart}
            >
              <Ionicons name="cart" size={16} color={colors.buttonText} />
            </Pressable>
          )}
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar backgroundColor={colors.background} barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading restaurant...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !restaurant) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar backgroundColor={colors.background} barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.textSecondary} />
          <Text style={[styles.errorText, { color: colors.text }]}>{error || 'Restaurant not found'}</Text>
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Restaurant Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View style={styles.coverPhotoContainer}>
          <Image 
            source={{ uri: restaurant.coverImage || restaurant.image }} 
            style={styles.coverPhoto}
            resizeMode="cover"
          />
          <View style={styles.coverPhotoOverlay} />
        </View>

        {/* Restaurant Info */}
        <View style={[styles.restaurantInfo, { backgroundColor: colors.card }]}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: restaurant.logo || restaurant.image }} 
              style={styles.logo}
              resizeMode="cover"
            />
          </View>

          {/* Restaurant Details */}
          <View style={styles.restaurantDetails}>
            <Text style={[styles.restaurantName, { color: colors.text }]}>{restaurant.name}</Text>
            
            {/* Location */}
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                {restaurant.address || restaurant.location}
              </Text>
            </View>

            {/* Rating */}
            {restaurant.rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {restaurant.rating.toFixed(1)} ({restaurant.reviews || 0} reviews)
                </Text>
              </View>
            )}

            {/* Description */}
            {restaurant.description && (
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {restaurant.description}
              </Text>
            )}

            {/* Status */}
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusIndicator, 
                { backgroundColor: restaurant.isOpen ? '#4CAF50' : '#F44336' }
              ]} />
              <Text style={[styles.statusText, { color: colors.text }]}>
                {restaurant.isOpen ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={[styles.menuTitle, { color: colors.text }]}>Menu</Text>
          {meals.length > 0 ? (
            <View style={styles.menuGrid}>
              {meals.map((meal) => (
                <View key={meal.id}>
                  {renderMealItem({ item: meal })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noMenuContainer}>
              <Ionicons name="restaurant" size={48} color={colors.textSecondary} />
              <Text style={[styles.noMenuText, { color: colors.textSecondary }]}>
                No menu items available
              </Text>
            </View>
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
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  coverPhotoContainer: {
    height: 200,
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverPhotoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  restaurantInfo: {
    marginTop: -50,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    alignSelf: 'center',
    marginTop: -60,
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  restaurantDetails: {
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuSection: {
    padding: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuGrid: {
    gap: 12,
  },
  mealItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  mealItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  mealItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mealItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  mealItemDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  mealItemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  mealItemActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  removeButton: {
    backgroundColor: 'transparent',
  },
  addButton: {
    borderWidth: 0,
  },
  quantityDisplay: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addToCartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMenuContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noMenuText: {
    fontSize: 16,
    marginTop: 8,
  },
});