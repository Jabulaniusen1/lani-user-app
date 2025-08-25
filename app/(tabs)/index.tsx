import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { View } from "@/components/Themed";
import StyledText from "@/components/StyledText";
import { useCart } from "@/components/CartContext";

const { width } = Dimensions.get("window");

// Dummy data for restaurants
const popularRestaurants = [
  {
    id: "1",
    name: "Eni Stores",
    location: "Nsikak Eduok",
    image: require("@/assets/images/eni-stores.png"),
    rating: 4.5,
    reviews: 1234,
    deliveryTime: "25-30 min",
  },
  {
    id: "2",
    name: "Kilimanjaro",
    location: "Ikot Ekpene Road",
    image: require("@/assets/images/kilimajaro.png"),
    rating: 4.3,
    reviews: 856,
    deliveryTime: "20-25 min",
  },
  {
    id: "3",
    name: "Chicken Republic",
    location: "Ikot Ekpene Road",
    image: require("@/assets/images/chicken-republic.png"),
    rating: 4.7,
    reviews: 2103,
    deliveryTime: "15-20 min",
  },
  {
    id: "4",
    name: "Pizza Palace",
    location: "Main Street",
    image: require("@/assets/images/laanieats-logo.png"), // Keep logo for Pizza Palace since no specific image
    rating: 4.2,
    reviews: 567,
    deliveryTime: "30-35 min",
  },
];

// Dummy data for top meals
const topMeals = [
  {
    id: "1",
    name: "Shawarma & Coke",
    description:
      "Spicy beef or chicken shawarma wrapped fresh, served with ice-cold Coke.",
    price: "₦2,500",
    image: require("@/assets/images/shawarma-and-coke.png"),
    restaurant: "Kilimanjaro",
  },
  {
    id: "2",
    name: "Jellof Rice & Plantain",
    description:
      "Naija-style jollof rice with crispy, golden plantain slices. Pure comfort food.",
    price: "₦2,200",
    image: require("@/assets/images/jellof-rice.png"),
    restaurant: "Eni Stores",
  },
  {
    id: "3",
    name: "Chicken & Chips",
    description: "Crispy fried chicken with golden fries and special sauce.",
    price: "₦3,000",
    image: require("@/assets/images/laanieats-logo.png"), // Keep logo since no specific image exists
    restaurant: "Chicken Republic",
  },
  {
    id: "4",
    name: "Okro Soup & Garri",
    description:
      "Spicy Nigerian okro soup with assorted meat and vegetables, served with garri.",
    price: "₦1,800",
    image: require("@/assets/images/okra-soup.png"),
    restaurant: "Eni Stores",
  },
];

export default function HomeScreen() {
  const { addItem, state } = useCart();
  const scrollViewRef = React.useRef<FlatList>(null);
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = React.useState(0);
  const [image, setImage] = useState<string | null>(null);

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

  const handlePreviousRestaurants = () => {
    if (currentRestaurantIndex > 0) {
      const newIndex = currentRestaurantIndex - 1;
      setCurrentRestaurantIndex(newIndex);
      // Scroll to the previous set of restaurants
      scrollViewRef.current?.scrollToOffset({
        offset: newIndex * 160,
        animated: true,
      });
    }
  };

  const handleNextRestaurants = () => {
    const maxIndex = Math.max(0, popularRestaurants.length - 2); // Show 2 restaurants at a time
    if (currentRestaurantIndex < maxIndex) {
      const newIndex = currentRestaurantIndex + 1;
      setCurrentRestaurantIndex(newIndex);
      // Scroll to the next set of restaurants
      scrollViewRef.current?.scrollToOffset({
        offset: newIndex * 160,
        animated: true,
      });
    }
  };

  const renderRestaurantCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => router.push(`/restaurant/${item.id}`)}
    >
      <Image source={item.image} style={styles.restaurantImage} />
      <StyledText
        variant="body"
        weight="semibold"
        style={styles.restaurantName}
      >
        {item.name}
      </StyledText>
      <StyledText
        variant="caption"
        weight="regular"
        style={styles.restaurantLocation}
      >
        {item.location}
      </StyledText>
    </TouchableOpacity>
  );

  const renderMealCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.mealCard}
      onPress={() => router.push(`/meal/${item.id}`)}
    >
      <Image source={item.image} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <StyledText variant="subtitle" weight="bold" style={styles.mealName}>
          {item.name}
        </StyledText>
        <StyledText
          variant="body"
          weight="regular"
          style={styles.mealDescription}
        >
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
            <StyledText
              variant="button"
              weight="semibold"
              style={styles.orderNowButtonText}
            >
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
                restaurant: item.restaurant,
                quantity: 1,
              });
            }}
          >
            <StyledText
              variant="button"
              weight="semibold"
              style={styles.addToCartButtonText}
            >
              Add to Cart
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <SafeAreaView>
        <View style={styles.headerSection}>
          <View style={styles.welcomeSection}>
            <StyledText
              variant="title"
              weight="bold"
              style={styles.welcomeText}
            >
              Welcome, Annie
            </StyledText>
            <View style={styles.locationSection}>
              <Ionicons name="location" size={16} color="#4CAF50" />
              <StyledText
                variant="body"
                weight="medium"
                style={styles.locationText}
              >
                Ewet Housing Estate
              </StyledText>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.profileButton} onPress={pickImage}>
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
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => router.push("/cart")}
            >
              <Ionicons name="cart" size={24} color="#333" />
              {state.totalItems > 0 && (
                <View style={styles.cartBadge}>
                  <StyledText
                    variant="caption"
                    weight="bold"
                    style={styles.cartBadgeText}
                  >
                    {state.totalItems}
                  </StyledText>
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
            source={require("@/assets/images/what-are-you-eating.png")}
            style={styles.bannerImage}
          />
        </View>

        {/* Popular Restaurants Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <StyledText
              variant="subtitle"
              weight="bold"
              style={styles.sectionTitle}
            >
              Popular Restaurants
            </StyledText>
            <View style={styles.navigationArrows}>
              <TouchableOpacity
                style={[
                  styles.arrowButton,
                  currentRestaurantIndex === 0 && styles.arrowButtonDisabled,
                ]}
                onPress={handlePreviousRestaurants}
                disabled={currentRestaurantIndex === 0}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={currentRestaurantIndex === 0 ? "#CCC" : "#333"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.arrowButton,
                  currentRestaurantIndex >=
                    Math.max(0, popularRestaurants.length - 2) &&
                    styles.arrowButtonDisabled,
                ]}
                onPress={handleNextRestaurants}
                disabled={
                  currentRestaurantIndex >=
                  Math.max(0, popularRestaurants.length - 2)
                }
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={
                    currentRestaurantIndex >=
                    Math.max(0, popularRestaurants.length - 2)
                      ? "#CCC"
                      : "#333"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            ref={scrollViewRef}
            data={popularRestaurants}
            renderItem={renderRestaurantCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.restaurantsList}
            scrollEnabled={false}
          />
        </View>

        {/* Top Meals Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <StyledText
              variant="subtitle"
              weight="bold"
              style={styles.sectionTitle}
            >
              Top Meals
            </StyledText>
          </View>
          <FlatList
            data={topMeals}
            renderItem={renderMealCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f4",
    marginTop: 50,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
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
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  cartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
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
    backgroundColor: "#f4f5f4",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  navigationArrows: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "transparent",
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButtonDisabled: {
    opacity: 0.5,
  },
  restaurantsList: {
    paddingHorizontal: 16,
  },
  restaurantCard: {
    width: 160,
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
  },
  restaurantImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "cover",
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  restaurantLocation: {
    fontSize: 12,
    color: "#666",
  },
  mealCard: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
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
  },
  addToCartButtonText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "600",
  },
});
