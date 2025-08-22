import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text, View } from '@/components/Themed';

// Dummy search results
const searchResults = [
  {
    id: '1',
    name: 'Jollof Rice',
    restaurant: 'Eni Stores',
    price: '₦2,200',
    image: require('@/assets/images/laanieats-logo.png'),
    category: 'Rice & Pasta'
  },
  {
    id: '2',
    name: 'Shawarma',
    restaurant: 'Kilimanjaro',
    price: '₦2,500',
    image: require('@/assets/images/laanieats-logo.png'),
    category: 'Snacks'
  },
  {
    id: '3',
    name: 'Chicken & Chips',
    restaurant: 'Chicken Republic',
    price: '₦3,000',
    image: require('@/assets/images/laanieats-logo.png'),
    category: 'Main Course'
  },
  {
    id: '4',
    name: 'Pepper Soup',
    restaurant: 'Eni Stores',
    price: '₦1,800',
    image: require('@/assets/images/laanieats-logo.png'),
    category: 'Soups'
  }
];

const popularSearches = ['Jollof Rice', 'Shawarma', 'Chicken', 'Pizza', 'Soup', 'Salad'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(searchResults);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults(searchResults);
    } else {
      const filtered = searchResults.filter(item =>
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
        <Text style={styles.searchResultName}>{item.name}</Text>
        <Text style={styles.searchResultRestaurant}>{item.restaurant}</Text>
        <Text style={styles.searchResultCategory}>{item.category}</Text>
        <Text style={styles.searchResultPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPopularSearch = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.popularSearchChip}
      onPress={() => handleSearch(item)}
    >
      <Text style={styles.popularSearchText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for food, restaurants..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Popular Searches */}
      {searchQuery.length === 0 && (
        <View style={styles.popularSearchesContainer}>
          <Text style={styles.sectionTitle}>Popular Searches</Text>
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
        <Text style={styles.sectionTitle}>
          {searchQuery.length > 0 ? 'Search Results' : 'Recent Searches'}
        </Text>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  popularSearchesContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  popularSearchesList: {
    paddingHorizontal: 20,
  },
  popularSearchChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  popularSearchText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  searchResultsContainer: {
    paddingBottom: 30,
  },
  searchResultCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchResultImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    resizeMode: 'cover',
  },
  searchResultInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  searchResultName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  searchResultRestaurant: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  searchResultCategory: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  searchResultPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
});
