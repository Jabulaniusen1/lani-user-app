import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import StyledText from "@/components/StyledText";
import { useCart } from "@/components/CartContext";
import Colors from "@/constants/Colors";
import { useData } from "@/contexts/DataContext";
import { Meal } from "@/redux/lani_eats";
import { useSession } from "@/auth/ctx";
import LoadingButton from "@/components/LoadingButton";

const { width } = Dimensions.get("window");

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCart();
  const { session } = useSession();
  const { fetchMealById } = useData();
  
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadMealData();
  }, [id]);

  const loadMealData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const mealData = await fetchMealById(id);
      
      if (mealData) {
        setMeal(mealData);
      } else {
        setError("Meal not found");
      }
    } catch (err) {
      setError("Failed to load meal data");
      console.error("Error loading meal data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!meal) return;
    
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
    
    setIsAddingToCart(true);
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      addItem({
        id: meal.id,
        name: meal.name,
        price: `₦${meal.price.toLocaleString()}`,
        image: { uri: meal.image },
        restaurant: meal.restaurantName,
        quantity: quantity,
      });
      setIsAddingToCart(false);
      Alert.alert("Success", "Item added to cart!");
    }, 500);
  };

  const handleOrderNow = () => {
    if (!session) {
      Alert.alert(
        "Login Required",
        "Please login to place orders.",
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
    
    // Add to cart and navigate to checkout
    handleAddToCart();
    setTimeout(() => {
      router.push("/(protected)/checkout");
    }, 600);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar backgroundColor={Colors.myDefinedColors.background} />
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading meal details...</Text>
      </View>
    );
  }

  if (error || !meal) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar backgroundColor={Colors.myDefinedColors.background} />
        <Ionicons name="alert-circle" size={64} color="#FF6B35" />
        <Text style={styles.errorText}>{error || "Meal not found"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMealData}>
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
        <Text style={styles.headerTitle}>{meal.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Meal Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: meal.image }} style={styles.mealImage} />
        </View>

        {/* Meal Info */}
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.restaurantName}>{meal.restaurantName}</Text>
          <Text style={styles.mealDescription}>{meal.description}</Text>
          
          <View style={styles.mealStats}>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color="#4CAF50" />
              <Text style={styles.statText}>{meal.preparationTime} min</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>{meal.rating || 4.5}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="restaurant" size={16} color="#FF6B35" />
              <Text style={styles.statText}>{meal.category}</Text>
            </View>
          </View>

          <Text style={styles.price}>₦{meal.price.toLocaleString()}</Text>
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>Quantity</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={20} color="#FF6B35" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Ionicons name="add" size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <LoadingButton
            title="Add to Cart"
            onPress={handleAddToCart}
            loading={isAddingToCart}
            variant="secondary"
            style={styles.addToCartButton}
          />
          <LoadingButton
            title="Order Now"
            onPress={handleOrderNow}
            loading={isAddingToCart}
            style={styles.orderNowButton}
          />
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
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 36,
  },
  imageContainer: {
    height: 250,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  mealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mealInfo: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  mealName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  mealDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  mealStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 14,
    color: "#1A1A1A",
    marginLeft: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
  },
  quantitySection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
  },
  orderNowButton: {
    flex: 1,
  },
});