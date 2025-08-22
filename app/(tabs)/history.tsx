import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text, View } from '@/components/Themed';

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
      onPress={() => router.push(`/order/${item.id}`)}
    >
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.orderItems}>
        {item.items.map((meal: any, index: number) => (
          <View key={meal.id} style={styles.mealItem}>
            <Image source={meal.image} style={styles.mealImage} />
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealRestaurant}>{meal.restaurant}</Text>
              <Text style={styles.mealQuantity}>Qty: {meal.quantity}</Text>
            </View>
            <Text style={styles.mealPrice}>{meal.price}</Text>
          </View>
        ))}
      </View>

      {/* Order Footer */}
      <View style={styles.orderFooter}>
        <View style={styles.deliveryInfo}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.deliveryAddress}>{item.deliveryAddress}</Text>
        </View>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{item.totalAmount}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.reorderButton}>
          <Text style={styles.reorderButtonText}>Reorder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
        <Text style={styles.headerSubtitle}>Track your previous orders</Text>
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  orderHistoryContainer: {
    paddingTop: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
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
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  mealRestaurant: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  mealQuantity: {
    fontSize: 12,
    color: '#999',
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  totalSection: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  reorderButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 20,
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
