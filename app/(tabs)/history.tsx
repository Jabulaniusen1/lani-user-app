import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { View } from "@/components/Themed";
import StyledText from "@/components/StyledText";
import Colors from "@/constants/Colors";

// Dummy order history data
const orderHistory = [
  {
    id: "1",
    name: "French fries and Chicken nuggets",
    quantity: 2,
    status: "Delivered",
    statusColor: "#edf6ee",
  },
  {
    id: "2",
    name: "Jellof rice and beef, dodo and fried eggs",
    quantity: 2,
    status: "Delivered",
    statusColor: "#edf6ee",
  },
  {
    id: "3",
    name: "Jellof rice and beef, dodo and fried eggs",
    quantity: 2,
    status: "Delivered",
    statusColor: "#edf6ee",
  },
  {
    id: "4",
    name: "Jellof rice and beef, dodo and fried eggs",
    quantity: 2,
    status: "Delivered",
    statusColor: "#edf6ee",
  },
  {
    id: "5",
    name: "Jellof rice and beef, dodo and fried eggs",
    quantity: 2,
    status: "Delivered",
    statusColor: "#edf6ee",
  },
];

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderLeft}>
        <Ionicons
          name="time-outline"
          size={20}
          color="#666"
          style={styles.timeIcon}
        />
        <View style={styles.orderInfo}>
          <StyledText variant="subtitle" weight="bold" style={styles.orderName}>
            {item.name}
          </StyledText>
          <StyledText
            variant="body"
            weight="regular"
            style={styles.orderQuantity}
          >
            Quantity: {item.quantity} servings
          </StyledText>
          <View style={styles.statusContainer}>
            <StyledText
              variant="caption"
              weight="medium"
              style={styles.statusLabel}
            >
              Order Status:
            </StyledText>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.statusColor },
              ]}
            >
              <StyledText
                variant="caption"
                weight="semibold"
                style={styles.statusText}
              >
                {item.status}
              </StyledText>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: "#FFE5E5" }]}>
              <StyledText
                variant="caption"
                weight="semibold"
                style={styles.declinedText}
              >
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
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.myDefinedColors.background} barStyle="dark-content" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.myDefinedColors.background,
  },
  searchContainer: {
    backgroundColor: Colors.myDefinedColors.historyScreenTopBackground,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.myDefinedColors.textInputGray,
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
    // backgroundColor: 'red'
  },
  orderList: {
    paddingHorizontal: 16,
  },
  orderItem: {
    backgroundColor: Colors.myDefinedColors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  orderLeft: {
    backgroundColor: Colors.myDefinedColors.background,
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
  },
  timeIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  orderInfo: {
    flex: 1,
    backgroundColor: Colors.myDefinedColors.background,
  },
  orderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  orderQuantity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statusContainer: {
    backgroundColor: Colors.myDefinedColors.background,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: "#666",
    backgroundColor: Colors.myDefinedColors.textInputGray,
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
    color: "#1A1A1A",
    fontWeight: "500",
  },
  declinedText: {
    fontSize: 12,
    color: "#FF3B30",
    fontWeight: "500",
  },
  deleteButton: {
    padding: 8,
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "gray",
    marginHorizontal: 0,
  },
});
