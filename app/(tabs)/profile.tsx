import React from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { View } from "@/components/Themed";
import StyledText from "@/components/StyledText";

export default function ProfileScreen() {
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const profileMenuItems = [
    {
      id: "1",
      title: "Dark mode",
      icon: "moon-outline",
      action: null,
      showArrow: false,
      isSwitch: true,
      switchValue: darkModeEnabled,
      onSwitchChange: setDarkModeEnabled,
    },
    {
      id: "2",
      title: "Orders",
      icon: "document-text-outline",
      action: () => console.log("Orders"),
      showArrow: true,
    },
    {
      id: "3",
      title: "Settings",
      icon: "settings-outline",
      action: () => console.log("Settings"),
      showArrow: true,
    },
    {
      id: "4",
      title: "Payment method",
      icon: "wallet-outline",
      action: () => console.log("Payment method"),
      showArrow: true,
    },
    {
      id: "5",
      title: "Help",
      icon: "help-circle-outline",
      action: () => console.log("Help"),
      showArrow: true,
    },
    {
      id: "6",
      title: "Privacy policy",
      icon: "shield-checkmark-outline",
      action: () => console.log("Privacy policy"),
      showArrow: true,
    },
    {
      id: "7",
      title: "Log out",
      icon: "log-out-outline",
      action: () => router.push("/auth/login"),
      showArrow: false,
      isDestructive: true,
    },
    {
      id: "8",
      title: "Sign in as a rider",
      icon: "person-add-outline",
      action: () => console.log("Sign in as a rider"),
      showArrow: true,
    },
  ];

  const renderMenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={item.action}
      disabled={item.isSwitch}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons
          name={item.icon as any}
          size={24}
          color={item.isDestructive ? "#FF3B30" : "#666"}
        />
        <StyledText
          variant="body"
          weight="medium"
          style={[
            styles.menuItemTitle,
            item.isDestructive && styles.menuItemTitleDestructive,
          ]}
        >
          {item.title}
        </StyledText>
      </View>

      {item.isSwitch ? (
        <Switch
          value={item.switchValue}
          onValueChange={item.onSwitchChange}
          trackColor={{ false: "#E0E0E0", true: "#FF6B35" }}
          thumbColor={item.switchValue ? "#FFFFFF" : "#FFFFFF"}
        />
      ) : item.showArrow ? (
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://avatar.iran.liara.run/public/girl?username=Annie",
          }}
          style={styles.profileImage}
        />
        <StyledText variant="title" weight="bold" style={styles.profileName}>
          Annie Davies
        </StyledText>
        <TouchableOpacity style={styles.editProfileButton}>
          <StyledText
            variant="body"
            weight="medium"
            style={styles.editProfileText}
          >
            Edit profile {">"}
          </StyledText>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {profileMenuItems.map((item) => (
          <View key={item.id}>
            {renderMenuItem({ item })}
            {item.id !== profileMenuItems[profileMenuItems.length - 1].id && (
              <View style={styles.menuDivider} />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginTop: StatusBar.currentHeight,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
  },
  editProfileButton: {
    paddingVertical: 8,
  },
  editProfileText: {
    fontSize: 14,
    color: "#FF6B35",
    fontWeight: "500",
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemTitle: {
    fontSize: 14,
    color: "#1A1A1A",
    marginLeft: 12,
  },
  menuItemTitleDestructive: {
    color: "#FF3B30",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 20,
  },
});
