import React, { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, Image, View, Text, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Color } from '@/constants/Colour';

// import { View } from '@/components/Themed';
// import StyledText from '@/components/StyledText';
import { useCart } from '@/components/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingButton from '@/components/LoadingButton';

export default function CartScreen() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleCheckout = async () => {
    setIsNavigating(true);
    // Simulate brief loading for better UX
    setTimeout(() => {
      router.push('/(protected)/checkout');
      setIsNavigating(false);
    }, 300);
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
          <Pressable 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </Pressable>
          <Text  style={styles.headerTitle}>
            Cart
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={80} color="#CCC" />
          <Text style={styles.emptyCartTitle}>
            Your cart is empty
          </Text>
          <Text style={styles.emptyCartSubtitle}>
            Add some delicious meals to get started!
          </Text>
          <Pressable 
            style={styles.startShoppingButton}
            onPress={() => router.back()}
          >
            <Text style={styles.startShoppingButtonText}>
              Start Shopping
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text  style={styles.headerTitle}>
          Cart
        </Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.cartItemsContainer} showsVerticalScrollIndicator={false}>
        {state.items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={item.image} style={styles.cartItemImage} />
            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemName}>
                {item.name}
              </Text>
              <Text style={styles.cartItemPrice}>
                {item.price}
              </Text>
              <View style={styles.quantitySelector}>
                <Pressable 
                  style={styles.quantityButton}
                  onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={16} color="#ffffff" />
                </Pressable>
                <Text style={styles.quantityText}>
                  {item.quantity}
                </Text>
                <Pressable 
                  style={styles.quantityButton}
                  onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Ionicons name="add" size={16} color="#ffffff" />
                </Pressable>
              </View>
            </View>
            
            <Pressable 
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF6B35" />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Cart Summary */}
      <View style={styles.cartSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Subtotal:
          </Text>
          <Text  style={styles.summaryValue}>
            ₦{state.totalAmount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Delivery fee:
          </Text>
          <Text style={styles.summaryValue}>
            ₦1,000
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text  style={styles.summaryLabel}>
            Service charge:
          </Text>
          <Text style={styles.summaryValue}>
            ₦1,000
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text  style={styles.totalLabel}>
            Total:
          </Text>
          <Text style={styles.totalValue}>
            ₦{(state.totalAmount + 2000).toLocaleString()}
          </Text>
        </View>
        
        <LoadingButton
          title="Checkout"
          onPress={handleCheckout}
          loading={isNavigating}
          style={styles.checkoutButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    marginTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
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
