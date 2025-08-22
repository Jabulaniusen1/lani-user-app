import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, View as RNView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { View } from '@/components/Themed';
import StyledText from '@/components/StyledText';

export default function CheckoutScreen() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [houseAddress, setHouseAddress] = useState('');

  const handleCheckout = () => {
    // Implement checkout functionality
    console.log('Proceeding to checkout with:', { fullName, phoneNumber, houseAddress });
    // You can navigate to payment or order confirmation here
  };

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
        <StyledText variant="title" weight="bold" style={styles.headerTitle}>
          Checkout
        </StyledText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Address Section */}
        <View style={styles.currentAddressCard}>
          <View style={styles.addressHeader}>
            <StyledText variant="subtitle" weight="bold" style={styles.addressTitle}>
              Home
            </StyledText>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={16} color="#FF6B35" />
              <StyledText variant="body" weight="regular" style={styles.contactText}>
                0812222222
              </StyledText>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="location-outline" size={16} color="#FF6B35" />
              <StyledText variant="body" weight="regular" style={styles.contactText}>
                15 Nsikak Eduok, Uyo
              </StyledText>
            </View>
          </View>
        </View>

        {/* Add New Address Section */}
        <View style={styles.newAddressSection}>
          <StyledText variant="subtitle" weight="bold" style={styles.sectionTitle}>
            Add a New Address
          </StyledText>
          
          <View style={styles.inputGroup}>
            <StyledText variant="body" weight="medium" style={styles.inputLabel}>
              Full name
            </StyledText>
            <TextInput
              style={styles.textInput}
              placeholder="Full name here"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputGroup}>
            <StyledText variant="body" weight="medium" style={styles.inputLabel}>
              Phone number
            </StyledText>
            <TextInput
              style={styles.textInput}
              placeholder="+234 *******"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <StyledText variant="body" weight="medium" style={styles.inputLabel}>
              House Address
            </StyledText>
            <TextInput
              style={styles.textInput}
              placeholder="Road, Area, Building name"
              placeholderTextColor="#999"
              value={houseAddress}
              onChangeText={setHouseAddress}
              multiline
            />
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.bottomSection}>
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
    backgroundColor: '#f4f5f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
    marginTop: 50,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  currentAddressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    gap: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 8,
  },
  newAddressSection: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
