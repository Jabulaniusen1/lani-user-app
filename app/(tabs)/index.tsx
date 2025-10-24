import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  StatusBar,
  Platform,
  View,
  Text,
  Pressable,
  ImageSourcePropType,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/components/CartContext";
import { useSession } from "@/auth/ctx";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";

// Dummy data for restaurants
// const popularRestaurants = [
//   {
//     id: "1",
//     name: "Eni Stores",
//     location: "Nsikak Eduok",
//     image: require("../../assets/images/eni-stores.png"),
//     rating: 4.5,
//     reviews: 1234,
//     deliveryTime: "25-30 min",
//   },
//   {
//     id: "2",
//     name: "Kilimanjaro",
//     location: "Ikot Ekpene Road",
//     image: require("../../assets/images/kilimajaro.png"),
//     rating: 4.3,
//     reviews: 856,
//     deliveryTime: "20-25 min",
//   },
//   {
//     id: "3",
//     name: "Chicken Republic",
//     location: "Ikot Ekpene Road",
//     image: require("../../assets/images/chicken-republic.png"),
//     rating: 4.7,
//     reviews: 2103,
//     deliveryTime: "15-20 min",
//   },
//   {
//     id: "4",
//     name: "Pizza Palace",
//     location: "Main Street",
//     image: require("../../assets/images/laanieats-logo.png"), // Keep logo for Pizza Palace since no specific image
//     rating: 4.2,
//     reviews: 567,
//     deliveryTime: "30-35 min",
//   },
// ];

// Dummy data for top meals
// const topMeals = [
//   {
//     id: "1",
//     name: "Shawarma & Coke",
//     description:
//       "Spicy beef or chicken shawarma wrapped fresh, served with ice-cold Coke.",
//     price: "₦2,500",
//     image: require("@/assets/images/shawarma-and-coke.png"),
//     restaurant: "Kilimanjaro",
//   },
//   {
//     id: "2",
//     name: "Jellof Rice & Plantain",
//     description:
//       "Naija-style jollof rice with crispy, golden plantain slices. Pure comfort food.",
//     price: "₦2,200",
//     image: require("@/assets/images/jellof-rice.png"),
//     restaurant: "Eni Stores",
//   },
//   {
//     id: "3",
//     name: "Chicken & Chips",
//     description: "Crispy fried chicken with golden fries and special sauce.",
//     price: "₦3,000",
//     image: require("@/assets/images/laanieats-logo.png"), // Keep logo since no specific image exists
//     restaurant: "Chicken Republic",
//   },
//   {
//     id: "4",
//     name: "Okro Soup & Garri",
//     description:
//       "Spicy Nigerian okro soup with assorted meat and vegetables, served with garri.",
//     price: "₦1,800",
//     image: require("@/assets/images/okra-soup.png"),
//     restaurant: "Eni Stores",
//   },
// ];

import { Restaurant, Meal } from "@/redux/lani_eats";

export default function HomeScreen() {
  const { addItem, state } = useCart();
  const { session } = useSession();
  const { popularRestaurants, topMeals, loadingRestaurants, loadingMeals } = useData();
  const { colors, isDark } = useTheme();

  console.log('🏠 [HomeScreen] Component rendered with data:', {
    popularRestaurantsCount: popularRestaurants.length,
    topMealsCount: topMeals.length,
    loadingRestaurants,
    loadingMeals,
    hasSession: !!session
  });
  const [image, setImage] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  //=====THIS FUNCTION ALLOWS A USER CHOOSE A PHOTO FROM THE GALLERY=====//
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  //===========ENDS HERE=================//


  //=======FLATLIST RENDERS THE POPULAR RESTURANT SECTION==========//
  function renderRestaurantCard({ item }: { item: Restaurant }) {
    console.log('🏠 [HomeScreen] Rendering restaurant card:', {
      id: item.id,
      name: item.name,
      coverImage: item.coverImage,
      image: item.image,
      address: item.address,
      location: item.location
    });
    
    return (
      <Pressable
        style={[styles.restaurantCard, { backgroundColor: colors.card }]}
        onPress={() =>
          router.push({
            pathname: "/restaurant/[id]",
            params: {
              id: item.id,
            },
          })
        }
      >
        <Image source={{ uri: item.coverImage || item.image }} style={styles.restaurantImage} />
        <Text style={[styles.restaurantName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.restaurantLocation, { color: colors.textSecondary }]}>{item.address || item.location}</Text>
      </Pressable>
    );
  }

  //=======FLATLIST RENDERS THE TOP MEAL SECTION==========//
  const renderMealCard = ({ item }: { item: Meal }) => (
    <Pressable
      style={[styles.mealCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/meal/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={[styles.mealName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.mealDescription, { color: colors.textSecondary }]}>{item.description}</Text>
        <Text style={[styles.mealPrice, { color: colors.price }]}>₦{item.price.toLocaleString()}</Text>
        <View style={styles.mealActions}>
          <Pressable
            style={({ pressed }) => [
              styles.orderNowButton, 
              { backgroundColor: colors.primary },
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push(`/meal/${item.id}`)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.orderNowButtonText, { color: colors.buttonText }]}>Order now</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.addToCartButton, 
              { borderColor: colors.primary },
              pressed && styles.buttonPressed
            ]}
            onPress={async () => {
              if (!session) {
                // Show alert to login
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
              
              setIsAddingToCart(item.id);
              // Simulate a brief loading state for better UX
              setTimeout(() => {
                addItem({
                  id: item.id,
                  name: item.name,
                  price: `₦${item.price.toLocaleString()}`,
                  image: { uri: item.image },
                  restaurant: item.restaurantName,
                  quantity: 1,
                });
                setIsAddingToCart(null);
              }, 500);
            }}
            disabled={isAddingToCart === item.id}
          >
            {isAddingToCart === item.id ? (
              <Text style={[styles.addToCartButtonText, { color: colors.primary }]}>Adding...</Text>
            ) : (
              <Text style={[styles.addToCartButtonText, { color: colors.primary }]}>Add to Cart</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  // Show loading state
  if (loadingRestaurants || loadingMeals) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <StatusBar backgroundColor={colors.background} barStyle={isDark ? 'light-content' : 'dark-content'} />
        <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading delicious meals...</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.background} barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeText, { color: colors.text }]}>
              {session ? "Welcome back!" : "Welcome to Lani Eats!"}
            </Text>
            <View style={styles.locationSection}>
              <Ionicons name="location" size={16} color={colors.delivery} />
              <Text style={[styles.locationText, { color: colors.textSecondary }]}>Ewet Housing Estate</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            {session ? (
              <>
                <Pressable 
                  style={({ pressed }) => [
                    styles.profileButton,
                    pressed && styles.buttonPressed
                  ]} 
                  onPress={pickImage}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {image ? (
                    <Image source={{ uri: image }} style={styles.profileImage} />
                  ) : (
                    <Image
                      source={{
                        uri: "https://avatar.iran.liara.run/public/boy?username=Ash",
                      }}
                      style={styles.profileImage}
                    />
                  )}
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.cartButton,
                    pressed && styles.buttonPressed
                  ]}
                  onPress={() => router.push("/(protected)/cart")}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="cart" size={24} color={colors.text} />
                  {/* {state.totalItems > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{state.totalItems}</Text>
                    </View>
                  )} */}
                </Pressable>
                <Pressable 
                  style={({ pressed }) => [
                    styles.notificationButton,
                    pressed && styles.buttonPressed
                  ]}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="notifications" size={24} color={colors.text} />
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  style={({ pressed }) => [
                    styles.loginButton, 
                    { backgroundColor: colors.primary },
                    pressed && styles.buttonPressed
                  ]}
                  onPress={() => router.push("/auth/LoginForm")}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={[styles.loginButtonText, { color: colors.buttonText }]}>Login</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.signupButton, 
                    { borderColor: colors.primary },
                    pressed && styles.buttonPressed
                  ]}
                  onPress={() => router.push("/auth/RegistrationForm")}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={[styles.signupButtonText, { color: colors.primary }]}>Sign Up</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
        <View style={styles.bannerSection}>
          <Image
            source={require("../../assets/images/what-are-you-eating.png")}
            style={styles.bannerImage}
          />
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Restaurants</Text>
          </View>
          <View
            style={{
              paddingVertical: 10,
              backgroundColor: colors.background,
            }}
          >
            <FlatList
              data={popularRestaurants as any[]}
              renderItem={renderRestaurantCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.restaurantsList}
              scrollEnabled={true}
              decelerationRate="fast"
              snapToInterval={172} // Card width (160) + margin (12)
              snapToAlignment="start"
            />
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Meals</Text>
          </View>
          <FlatList
            data={topMeals as any[]}
            renderItem={renderMealCard}
            keyExtractor={(item) => item.id?.toString?.() || String(item.id)}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const shadow = Platform.select({
  android: { elevation: 4 },
  ios: {
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.65,
    shadowRadius: 4,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "transparent",
  },
  welcomeSection: {
    flex: 1,
    backgroundColor: "transparent",
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: "Bricolage-24pt-bold",
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 6,
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "transparent",
  },
  profileButton: {
    width: 44, // Increased for better touch target
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  cartButton: {
    width: 44, // Increased for better touch target
    height: 44,
    borderRadius: 22,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  notificationButton: {
    width: 44, // Increased for better touch target
    height: 44,
    borderRadius: 22,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerSection: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    alignItems: "center",
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    // height: 100,
    // borderRadius: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: "#F5F5F5",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#F5F5F5",
  },
  sectionTitle: {
    fontFamily: "Bricolage-24pt-bold",
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  restaurantsList: {
    paddingHorizontal: 16,
  },
  restaurantCard: {
    width: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  restaurantImage: {
    width: "100%",
    height: 90,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: "cover",
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 6,
    lineHeight: 20,
  },
  restaurantLocation: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  mealCard: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    ...shadow,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: "cover",
  },
  mealInfo: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  mealName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    lineHeight: 16,
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 8,
  },
  mealActions: {
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 8,
  },
  orderNowButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44, // iOS minimum touch target
  },
  orderNowButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  addToCartButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44, // iOS minimum touch target
  },
  addToCartButtonText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44, // iOS minimum touch target
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  signupButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF6B35",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44, // iOS minimum touch target
  },
  signupButtonText: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  // iOS-specific button improvements
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
