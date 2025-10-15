import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  View,
  Text,
  SafeAreaView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "@/constants/Colour";
import { useSession } from "@/auth/ctx";
import LoadingButton from "@/components/LoadingButton";

// import { View } from '@/components/Themed';
// import StyledText from "@/components/StyledText";

export default function CheckoutScreen() {
  const { session, logout } = useSession();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [houseAddress, setHouseAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!session) {
      Alert.alert(
        "Authentication Required",
        "You need to be logged in to access checkout. Please login to continue.",
        [
          { text: "Cancel", onPress: () => router.back() },
          { text: "Login", onPress: () => router.push("/auth/LoginForm") },
          { text: "Sign Up", onPress: () => router.push("/auth/RegistrationForm") }
        ]
      );
    }
  }, [session]);

  const handleCheckout = async () => {
    if (!session) {
      Alert.alert(
        "Authentication Required",
        "Please login to complete your order.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/auth/LoginForm") }
        ]
      );
      return;
    }

    setIsProcessing(true);
    // Simulate checkout processing
    setTimeout(() => {
      console.log("Proceeding to checkout with:", {
        fullName,
        phoneNumber,
        houseAddress,
      });
      // You can navigate to payment or order confirmation here
      setIsProcessing(false);
      Alert.alert("Success", "Your order has been placed successfully!");
    }, 2000);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          onPress: async () => {
            await logout();
            router.replace("/(tabs)");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B35" />
        </Pressable>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.currentAddressCard}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressTitle}>Home</Text>
            <Pressable style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#FF6B35" />
            </Pressable>
          </View>
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={16} color="#FF6B35" />
              <Text style={styles.contactText}>0812222222</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="location-outline" size={16} color="#FF6B35" />
              <Text style={styles.contactText}>15 Nsikak Eduok, Uyo</Text>
            </View>
          </View>
        </View>
        <View style={styles.newAddressSection}>
          <Text style={styles.sectionTitle}>Add a New Address</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Full name here"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone number</Text>
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
            <Text>House Address</Text>
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
      <View style={styles.bottomSection}>
        <LoadingButton
          title="Checkout"
          onPress={handleCheckout}
          loading={isProcessing}
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "transparent",
    marginTop: 50,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  currentAddressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  contactInfo: {
    gap: 12,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    fontSize: 14,
    color: "#1A1A1A",
    marginLeft: 8,
  },
  newAddressSection: {
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF6B35",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1A1A1A",
  },
  bottomSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  checkoutButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
