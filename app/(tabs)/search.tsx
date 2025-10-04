import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { View } from "@/components/Themed";
import StyledText from "@/components/StyledText";

// Dummy search results
const initialSearchResults = [
  {
    id: "1",
    name: "Jollof Rice",
    restaurant: "Eni Stores",
    price: "₦2,200",
    image: require("@/assets/images/laanieats-logo.png"),
    category: "Rice & Pasta",
  },
  {
    id: "2",
    name: "Shawarma",
    restaurant: "Kilimanjaro",
    price: "₦2,500",
    image: require("@/assets/images/laanieats-logo.png"),
    category: "Snacks",
  },
  {
    id: "3",
    name: "Chicken & Chips",
    restaurant: "Chicken Republic",
    price: "₦3,000",
    image: require("@/assets/images/laanieats-logo.png"),
    category: "Main Course",
  },
  {
    id: "4",
    name: "Pepper Soup",
    restaurant: "Eni Stores",
    price: "₦1,800",
    image: require("@/assets/images/laanieats-logo.png"),
    category: "Soups",
  },
];

const popularSearches = [
  "Jollof Rice",
  "Shawarma",
  "Chicken",
  "Pizza",
  "Soup",
  "Salad",
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(initialSearchResults);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults(initialSearchResults);
    } else {
      const filtered = initialSearchResults.filter(
        (item: any) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.restaurant.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.searchResultCard}
      onPress={() => router.push(`/meal/${item.id}`)}
    >
      <Image source={item.image} style={styles.searchResultImage} />
      <View style={styles.searchResultInfo}>
        <StyledText
          variant="subtitle"
          weight="bold"
          style={styles.searchResultName}
        >
          {item.name}
        </StyledText>
        <StyledText
          variant="body"
          weight="regular"
          style={styles.searchResultRestaurant}
        >
          {item.restaurant}
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
          style={styles.searchResultPrice}
        >
          {item.price}
        </StyledText>
      </View>
    </TouchableOpacity>
  );

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <StyledText variant="title" weight="bold" style={styles.headerTitle}>
          Search
        </StyledText>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for food, restaurants..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Popular Searches */}
      {searchQuery.length === 0 && (
        <View style={styles.popularSearchesContainer}>
          <StyledText
            variant="subtitle"
            weight="semibold"
            style={styles.sectionTitle}
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
      <View style={styles.searchResultsContainer}>
        <StyledText
          variant="subtitle"
          weight="semibold"
          style={styles.sectionTitle}
        >
          {searchQuery.length > 0 ? "Search Results" : "Recent Searches"}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff1e8",
    marginTop: StatusBar.currentHeight,
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
});
