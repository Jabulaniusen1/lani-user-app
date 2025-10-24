import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StatusBar,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { View } from "@/components/Themed";
import StyledText from "@/components/StyledText";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/components/CartContext";
import FirestoreService, { Meal } from "@/services/firestoreService";

const popularSearches = [
  "Jollof Rice",
  "Shawarma",
  "Chicken",
  "Pizza",
  "Soup",
  "Salad",
  "Pasta",
  "Burger",
  "Fries",
  "Rice",
];

export default function SearchScreen() {
  const { colors, isDark } = useTheme();
  const { state, addItem, removeItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [searchResults, setSearchResults] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllMeals();
  }, []);

  const fetchAllMeals = async () => {
    console.log('🔍 [SearchScreen] Fetching all meals...');
    setLoading(true);
    setError(null);

    try {
      const meals = await FirestoreService.getAllMealsFromAllRestaurants();
      console.log('🔍 [SearchScreen] Fetched meals:', meals.length);
      setAllMeals(meals);
      setSearchResults(meals);
    } catch (err) {
      console.error('🔍 [SearchScreen] Error fetching meals:', err);
      setError('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults(allMeals);
    } else {
      const filtered = allMeals.filter(
        (meal) =>
          meal.name.toLowerCase().includes(query.toLowerCase()) ||
          meal.restaurantName?.toLowerCase().includes(query.toLowerCase()) ||
          meal.category.toLowerCase().includes(query.toLowerCase()) ||
          (meal.description && meal.description.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filtered);
    }
  };

  const renderSearchResult = ({ item }: { item: Meal }) => {
    const cartItem = state.items.find(cartItem => cartItem.id === item.id);
    const quantityInCart = cartItem?.quantity || 0;

    const handleAddToCart = () => {
      addItem({
        id: item.id,
        name: item.name,
        price: `₦${item.price.toLocaleString()}`,
        image: item.image,
        restaurant: item.restaurantName || 'Unknown Restaurant',
        quantity: 1
      });
    };

    const handleRemoveFromCart = () => {
      removeItem(item.id);
    };

    return (
      <Pressable
        style={[styles.searchResultCard, { backgroundColor: colors.card }]}
        onPress={() => router.push(`/meal/${item.id}`)}
      >
        <Image source={{ uri: item.image }} style={styles.searchResultImage} />
        <View style={styles.searchResultInfo}>
          <StyledText
            variant="subtitle"
            weight="bold"
            style={[styles.searchResultName, { color: colors.text }]}
          >
            {item.name}
          </StyledText>
          <StyledText
            variant="body"
            weight="regular"
            style={[styles.searchResultRestaurant, { color: colors.textSecondary }]}
          >
            {item.restaurantName || 'Unknown Restaurant'}
          </StyledText>
          <StyledText
            variant="caption"
            weight="medium"
            style={styles.searchResultCategory}
          >
            {item.category}
          </StyledText>
          <StyledText
            variant="body"
            weight="semibold"
            style={[styles.searchResultPrice, { color: colors.price }]}
          >
            ₦{item.price.toLocaleString()}
          </StyledText>
        </View>
        
        {/* Cart Controls */}
        <View style={styles.cartControls}>
          {quantityInCart > 0 ? (
            <View style={styles.cartButtons}>
              <Pressable
                style={[styles.cartButton, styles.removeButton, { borderColor: colors.primary }]}
                onPress={handleRemoveFromCart}
              >
                <Ionicons name="remove" size={16} color={colors.primary} />
              </Pressable>
              
              <View style={[styles.quantityDisplay, { backgroundColor: colors.primary }]}>
                <StyledText
                  variant="caption"
                  weight="bold"
                  style={[styles.quantityText, { color: colors.buttonText }]}
                >
                  {quantityInCart}
                </StyledText>
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

  const renderPopularSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.popularSearchChip}
      onPress={() => handleSearch(item)}
    >
      <StyledText
        variant="body"
        weight="medium"
        style={styles.popularSearchText}
      >
        {item}
      </StyledText>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <StyledText
            variant="body"
            weight="medium"
            style={[styles.loadingText, { color: colors.textSecondary }]}
          >
            Loading meals...
          </StyledText>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.textSecondary} />
          <StyledText
            variant="body"
            weight="medium"
            style={[styles.errorText, { color: colors.text }]}
          >
            {error}
          </StyledText>
          <Pressable
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={fetchAllMeals}
          >
            <StyledText
              variant="body"
              weight="semibold"
              style={[styles.retryButtonText, { color: colors.buttonText }]}
            >
              Retry
            </StyledText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <StyledText variant="title" weight="bold" style={[styles.headerTitle, { color: colors.text }]}>
            Search
          </StyledText>
        </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search for food, restaurants..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={colors.textSecondary}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Popular Searches */}
      {searchQuery.length === 0 && (
        <View style={[styles.popularSearchesContainer, { backgroundColor: colors.background }]}>
          <StyledText
            variant="subtitle"
            weight="semibold"
            style={[styles.sectionTitle, { color: colors.text }]}
          >
            Popular Searches
          </StyledText>
          <FlatList
            data={popularSearches}
            renderItem={renderPopularSearch}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularSearchesList}
          />
        </View>
      )}

      {/* Search Results */}
      <View style={[styles.searchResultsContainer, { backgroundColor: colors.background }]}>
        <StyledText
          variant="subtitle"
          weight="semibold"
          style={[styles.sectionTitle, { color: colors.text }]}
        >
          {searchQuery.length > 0 ? `Search Results (${searchResults.length})` : `All Meals (${searchResults.length})`}
        </StyledText>
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff1e8",
  },
  header: {
    backgroundColor: "#fff1e8",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  searchContainer: {
    backgroundColor: "#fff1e8",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A1A",
  },
  popularSearchesContainer: {
    backgroundColor: "#fff1e8",
    marginBottom: 24,
    paddingBottom: 5,
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
    // paddingHorizontal: 16,
  },
  popularSearchesList: {
    // paddingHorizontal: 16,
  },
  popularSearchChip: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  popularSearchText: {
    fontSize: 14,
    color: "#666",
  },
  searchResultsContainer: {
    backgroundColor: "#fff1e8",
    paddingHorizontal: 16,
  },
  searchResultCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchResultImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: "cover",
  },
  searchResultInfo: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  searchResultRestaurant: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  searchResultCategory: {
    fontSize: 12,
    color: "#FF6B35",
    marginBottom: 6,
  },
  searchResultPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cartControls: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  cartButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addToCartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
