import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { View } from '@/components/Themed';
import StyledText from '@/components/StyledText';

// Dummy order history data
const orderHistory = [
  {
    id: '1',
    orderNumber: '#ORD-001',
    date: 'Today, 2:30 PM',
    status: 'Delivered',
    statusColor: '#4CAF50',
    items: [
      {
        id: '1',
        name: 'Jollof Rice & Plantain',
        quantity: 2,
        price: '₦2,200',
        image: require('@/assets/images/laanieats-logo.png'),
        restaurant: 'Eni Stores'
      }
    ],
    totalAmount: '₦4,400',
    deliveryAddress: 'Ewet Housing Estate, Uyo'
  },
  {
    id: '2',
    orderNumber: '#ORD-002',
    date: 'Yesterday, 7:15 PM',
    status: 'Delivered',
    statusColor: '#4CAF50',
    items: [
      {
        id: '2',
        name: 'Shawarma & Coke',
        quantity: 1,
        price: '₦2,500',
        image: require('@/assets/images/laanieats-logo.png'),
        restaurant: 'Kilimanjaro'
      }
    ],
    totalAmount: '₦2,500',
    deliveryAddress: 'Ewet Housing Estate, Uyo'
  },
  {
    id: '3',
    orderNumber: '#ORD-003',
    date: 'Dec 15, 2024, 1:45 PM',
    status: 'Delivered',
    statusColor: '#4CAF50',
    items: [
      {
        id: '3',
        name: 'Chicken & Chips',
        quantity: 1,
        price: '₦3,000',
        image: require('@/assets/images/laanieats-logo.png'),
        restaurant: 'Chicken Republic'
      },
      {
        id: '4',
        name: 'Pepper Soup',
        quantity: 1,
        price: '₦1,800',
        image: require('@/assets/images/laanieats-logo.png'),
        restaurant: 'Eni Stores'
      }
    ],
    totalAmount: '₦4,800',
    deliveryAddress: 'Ewet Housing Estate, Uyo'
  },
  {
    id: '4',
    orderNumber: '#ORD-004',
    date: 'Dec 12, 2024, 6:20 PM',
    status: 'Delivered',
    statusColor: '#4CAF50',
    items: [
      {
        id: '5',
        name: 'Margherita Pizza',
        quantity: 1,
        price: '₦4,500',
        image: require('@/assets/images/laanieats-logo.png'),
        restaurant: 'Pizza Palace'
      }
    ],
    totalAmount: '₦4,500',
    deliveryAddress: 'Ewet Housing Estate, Uyo'
  }
];

export default function HistoryScreen() {
  const renderOrderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      // onPress={() => router.push(`/order/${item.id}`)}
      onPress={() => console.log('Order details not implemented yet')}
    >
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <StyledText variant="body" weight="bold" style={styles.orderNumber}>
            {item.orderNumber}
          </StyledText>
          <StyledText variant="body" weight="regular" style={styles.orderDate}>
            {item.date}
          </StyledText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}>
          <StyledText variant="caption" weight="semibold" style={styles.statusText}>
            {item.status}
          </StyledText>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.orderItems}>
        {item.items.map((meal: any, index: number) => (
          <View key={meal.id} style={styles.mealItem}>
            <Image source={meal.image} style={styles.mealImage} />
            <View style={styles.mealInfo}>
              <StyledText variant="subtitle" weight="bold" style={styles.mealName}>
                {meal.name}
              </StyledText>
              <StyledText variant="body" weight="regular" style={styles.mealRestaurant}>
                {meal.restaurant}
              </StyledText>
              <StyledText variant="caption" weight="regular" style={styles.mealQuantity}>
                Qty: {meal.quantity}
              </StyledText>
            </View>
            <StyledText variant="body" weight="semibold" style={styles.mealPrice}>
              {meal.price}
            </StyledText>
          </View>
        ))}
      </View>

      {/* Order Footer */}
      <View style={styles.orderFooter}>
        <View style={styles.deliveryInfo}>
          <Ionicons name="location" size={16} color="#666" />
          <StyledText variant="body" weight="regular" style={styles.deliveryAddress}>
            {item.deliveryAddress}
          </StyledText>
        </View>
        <View style={styles.totalSection}>
          <StyledText variant="body" weight="regular" style={styles.totalLabel}>
            Total:
          </StyledText>
          <StyledText variant="subtitle" weight="bold" style={styles.totalAmount}>
            {item.totalAmount}
          </StyledText>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.reorderButton}>
          <StyledText variant="button" weight="semibold" style={styles.reorderButtonText}>
            Reorder
          </StyledText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewDetailsButton}>
          <StyledText variant="button" weight="semibold" style={styles.viewDetailsButtonText}>
            View Details
          </StyledText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <StyledText variant="title" weight="bold" style={styles.headerTitle}>
          Order History
        </StyledText>
        <StyledText variant="body" weight="regular" style={styles.headerSubtitle}>
          Track your previous orders
        </StyledText>
      </View>

      {/* Order History List */}
      <View style={styles.orderHistoryContainer}>
        <FlatList
          data={orderHistory}
          renderItem={renderOrderItem}
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
    backgroundColor: '#ffffff',
    marginTop: 50,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  orderHistoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  orderItems: {
    marginBottom: 16,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
    resizeMode: 'cover',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  mealRestaurant: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  mealQuantity: {
    fontSize: 12,
    color: '#999',
  },
  mealPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  orderFooter: {
    marginBottom: 16,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryAddress: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  reorderButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  reorderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  viewDetailsButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
});
