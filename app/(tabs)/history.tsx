import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, TextInput, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { View } from '@/components/Themed';
import StyledText from '@/components/StyledText';

// Dummy order history data
const orderHistory = [
  {
    id: '1',
    name: 'French fries and Chicken nuggets',
    quantity: 2,
    status: 'Delivered',
    statusColor: '#edf6ee',
  },
  {
    id: '2',
    name: 'Jellof rice and beef, dodo and fried eggs',
    quantity: 2,
    status: 'Delivered',
    statusColor: '#edf6ee',
  },
  {
    id: '3',
    name: 'Jellof rice and beef, dodo and fried eggs',
    quantity: 2,
    status: 'Delivered',
    statusColor: '#edf6ee',
  },
  {
    id: '4',
    name: 'Jellof rice and beef, dodo and fried eggs',
    quantity: 2,
    status: 'Delivered',
    statusColor: '#edf6ee',
  },
  {
    id: '5',
    name: 'Jellof rice and beef, dodo and fried eggs',
    quantity: 2,
    status: 'Delivered',
    statusColor: '#edf6ee',
  }
];

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderLeft}>
        <Ionicons name="time-outline" size={20} color="#666" style={styles.timeIcon} />
        <View style={styles.orderInfo}>
          <StyledText variant="subtitle" weight="bold" style={styles.orderName}>
            {item.name}
          </StyledText>
          <StyledText variant="body" weight="regular" style={styles.orderQuantity}>
            Quantity: {item.quantity} servings
          </StyledText>
          <View style={styles.statusContainer}>
            <StyledText variant="caption" weight="medium" style={styles.statusLabel}>
              Order Status:
            </StyledText>
            <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}>
              <StyledText variant="caption" weight="semibold" style={styles.statusText}>
                {item.status}
              </StyledText>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#FFE5E5' }]}>
              <StyledText variant="caption" weight="semibold" style={styles.declinedText}>
                Declined
              </StyledText>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color="#FF6B35" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Order History List */}
      <FlatList
        data={orderHistory}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.orderList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: StatusBar.currentHeight,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
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
    fontSize: 14,
    color: '#1A1A1A',
  },
  orderList: {
    paddingHorizontal: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  orderLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  timeIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  orderInfo: {
    flex: 1,
  },
  orderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  orderQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  declinedText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 0,
  },
});
