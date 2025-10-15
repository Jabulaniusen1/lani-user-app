import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { View as ThemedView } from "@/components/Themed";
import StyledText from "@/components/StyledText";
import { useCart } from "@/components/CartContext";
import Colors from "@/constants/Colors";
import { useData } from "@/contexts/DataContext";
import { Restaurant, Meal } from "@/redux/lani_eats";
import { useSession } from "@/auth/ctx";

const { width } = Dimensions.get("window");

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCart();
  const { session } = useSession();
  const { fetchRestaurantById, fetchMealsByRestaurant } = useData();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const loadRestaurantData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [restaurantData, mealsData] = await Promise.all([
        fetchRestaurantById(id),
        fetchMealsByRestaurant(id)
      ]);
      
      if (restaurantData) {
        setRestaurant(restaurantData);
      } else {
        setError("Restaurant not found");
      }
      
      setMeals(mealsData);
    } catch (err) {
      setError("Failed to load restaurant data");
      console.error("Error loading restaurant data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (meal: Meal) => {
    if (!session) {
      Alert.alert(
        "Login Required",
        "Please login to add items to your cart and place orders.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Login", 
            onPress: () => router.push("/auth/LoginForm") 
          },
          { 
            text: "Sign Up", 
            onPress: () => router.push("/auth/RegistrationForm") 
          }
        ]
      );
      return;
    }
    
    setIsAddingToCart(meal.id);
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      addItem({
        id: meal.id,
        name: meal.name,
        price: `₦${meal.price.toLocaleString()}`,
        image: { uri: meal.image },
        restaurant: meal.restaurantName,
        quantity: 1,
      });
      setIsAddingToCart(null);
    }, 500);
  };

  const renderMealItem = ({ item }: { item: Meal }) => (
    <View style={styles.mealItem}>
      <Image source={{ uri: item.image }} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealDescription}>{item.description}</Text>
        <View style={styles.mealFooter}>
          <Text style={styles.mealPrice}>₦{item.price.toLocaleString()}</Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              isAddingToCart === item.id && styles.addButtonDisabled
            ]}
            onPress={() => handleAddToCart(item)}
            disabled={isAddingToCart === item.id}
          >
            {isAddingToCart === item.id ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.addButtonText}>Add</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar backgroundColor={Colors.myDefinedColors.background} />
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading restaurant...</Text>
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar backgroundColor={Colors.myDefinedColors.background} />
        <Ionicons name="alert-circle" size={64} color="#FF6B35" />
        <Text style={styles.errorText}>{error || "Restaurant not found"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadRestaurantData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.myDefinedColors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{restaurant.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
          <View style={styles.restaurantDetails}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantLocation}>{restaurant.location}</Text>
            <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
            
            <View style={styles.restaurantStats}>
              <View style={styles.statItem}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.statText}>{restaurant.rating}</Text>
                <Text style={styles.statLabel}>({restaurant.reviews} reviews)</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time" size={16} color="#4CAF50" />
                <Text style={styles.statText}>{restaurant.deliveryTime}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Meals Section */}
        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {meals.length > 0 ? (
            <FlatList
              data={meals}
              renderItem={renderMealItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyMenu}>
              <Ionicons name="restaurant" size={48} color="#CCC" />
              <Text style={styles.emptyMenuText}>No meals available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.myDefinedColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.myDefinedColors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.myDefinedColors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "transparent",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  placeholder: {
    width: 36,
  },
  restaurantInfo: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  restaurantImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  restaurantDetails: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  restaurantLocation: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  restaurantDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  restaurantStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginLeft: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  mealsSection: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  mealItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: "row",
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
  mealFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  addButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyMenu: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyMenuText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
});