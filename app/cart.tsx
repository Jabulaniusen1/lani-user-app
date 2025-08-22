import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, View as RNView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { View } from '@/components/Themed';
import StyledText from '@/components/StyledText';
import { useCart } from '@/components/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    // Implement checkout functionality
    console.log('Proceeding to checkout with:', state.items);
    // You can navigate to a checkout screen here
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  if (state.items.length === 0) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <StyledText variant="subtitle" weight="semibold" style={styles.headerTitle}>
            Cart
          </StyledText>
          <View style={styles.placeholder} />
        </View>

        {/* Empty Cart */}
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={80} color="#CCC" />
          <StyledText variant="title" weight="bold" style={styles.emptyCartTitle}>
            Your cart is empty
          </StyledText>
          <StyledText variant="body" weight="regular" style={styles.emptyCartSubtitle}>
            Add some delicious meals to get started!
          </StyledText>
          <TouchableOpacity 
            style={styles.startShoppingButton}
            onPress={() => router.back()}
          >
            <StyledText variant="button" weight="semibold" style={styles.startShoppingButtonText}>
              Start Shopping
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <StyledText variant="subtitle" weight="semibold" style={styles.headerTitle}>
          Cart
        </StyledText>
        <View style={styles.placeholder} />
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.cartItemsContainer} showsVerticalScrollIndicator={false}>
        {state.items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={item.image} style={styles.cartItemImage} />
            <View style={styles.cartItemInfo}>
              <StyledText variant="subtitle" weight="bold" style={styles.cartItemName}>
                {item.name}
              </StyledText>
              <StyledText variant="body" weight="semibold" style={styles.cartItemPrice}>
                {item.price}
              </StyledText>
              <View style={styles.quantitySelector}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={16} color="#ffffff" />
                </TouchableOpacity>
                <StyledText variant="body" weight="semibold" style={styles.quantityText}>
                  {item.quantity}
                </StyledText>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Ionicons name="add" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Cart Summary */}
      <View style={styles.cartSummary}>
        <View style={styles.summaryRow}>
          <StyledText variant="body" weight="regular" style={styles.summaryLabel}>
            Subtotal:
          </StyledText>
          <StyledText variant="body" weight="medium" style={styles.summaryValue}>
            ₦{state.totalAmount.toLocaleString()}
          </StyledText>
        </View>
        <View style={styles.summaryRow}>
          <StyledText variant="body" weight="regular" style={styles.summaryLabel}>
            Delivery fee:
          </StyledText>
          <StyledText variant="body" weight="medium" style={styles.summaryValue}>
            ₦1,000
          </StyledText>
        </View>
        <View style={styles.summaryRow}>
          <StyledText variant="body" weight="regular" style={styles.summaryLabel}>
            Service charge:
          </StyledText>
          <StyledText variant="body" weight="medium" style={styles.summaryValue}>
            ₦1,000
          </StyledText>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <StyledText variant="subtitle" weight="bold" style={styles.totalLabel}>
            Total:
          </StyledText>
          <StyledText variant="title" weight="bold" style={styles.totalValue}>
            ₦{(state.totalAmount + 2000).toLocaleString()}
          </StyledText>
        </View>
        
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <StyledText variant="button" weight="semibold" style={styles.checkoutButtonText}>
            Checkout
          </StyledText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 36,
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  startShoppingButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startShoppingButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cartItemsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
  },
  cartItemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginHorizontal: 8,
    minWidth: 16,
    textAlign: 'center',
  },
  removeButton: {
    padding: 6,
    marginLeft: 6,
  },
  cartSummary: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
