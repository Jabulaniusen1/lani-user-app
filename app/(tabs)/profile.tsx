import { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { View } from "@/components/Themed";
import StyledText from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useSession } from "@/auth/ctx";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingButton from "@/components/LoadingButton";
import { useTheme } from "@/contexts/ThemeContext";

export default function ProfileScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { session, user, logout } = useSession();
  const { colors, isDark, themeMode, setThemeMode, toggleTheme } = useTheme();
  
  // Check if user is logged in (session is a token string, not null/undefined)
  const isLoggedIn = session && session.length > 0;
  
  // Debug logging
  console.log('🔐 [ProfileScreen] Session state:', {
    session: session ? 'Token present' : 'No token',
    sessionLength: session?.length || 0,
    isLoggedIn,
    user: user ? {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    } : 'No user'
  });

  function logoutHandler() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Logout",
        onPress: async () => {
          setIsLoggingOut(true);
          await logout();
          // Navigation will be handled by auth state change
          setIsLoggingOut(false);
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  }

  function loginHandler() {
    router.push("/auth/LoginForm");
  }

  function signupHandler() {
    router.push("/auth/RegistrationForm");
  }

  const profileMenuItems = isLoggedIn ? [
    {
      id: "1",
      title: "Dark mode",
      icon: isDark ? "moon" : "moon-outline",
      action: null,
      showArrow: false,
      isSwitch: true,
      switchValue: isDark,
      onSwitchChange: toggleTheme,
    },
    {
      id: "2",
      title: "Theme",
      icon: "color-palette-outline",
      action: () => {
        Alert.alert(
          "Choose Theme",
          "Select your preferred theme",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Light", 
              onPress: () => setThemeMode('light'),
              style: themeMode === 'light' ? 'default' : 'cancel'
            },
            { 
              text: "Dark", 
              onPress: () => setThemeMode('dark'),
              style: themeMode === 'dark' ? 'default' : 'cancel'
            },
            { 
              text: "System", 
              onPress: () => setThemeMode('system'),
              style: themeMode === 'system' ? 'default' : 'cancel'
            },
          ]
        );
      },
      showArrow: true,
    },
    {
      id: "3",
      title: "Orders",
      icon: "document-text-outline",
      action: () => console.log("Orders"),
      showArrow: true,
    },
    {
      id: "4",
      title: "Settings",
      icon: "settings-outline",
      action: () => console.log("Settings"),
      showArrow: true,
    },
    {
      id: "5",
      title: "Payment method",
      icon: "wallet-outline",
      action: () => console.log("Payment method"),
      showArrow: true,
    },
    {
      id: "6",
      title: "Help",
      icon: "help-circle-outline",
      action: () => console.log("Help"),
      showArrow: true,
    },
    {
      id: "7",
      title: "Privacy policy",
      icon: "shield-checkmark-outline",
      action: () => console.log("Privacy policy"),
      showArrow: true,
    },
    {
      id: "8",
      title: "Log out",
      icon: "log-out-outline",
      action: logoutHandler,
      showArrow: false,
      isDestructive: true,
    },
    {
      id: "9",
      title: "Sign in as a rider",
      icon: "person-add-outline",
      action: () => console.log("Sign in as a rider"),
      showArrow: true,
    },
  ] : [
    {
      id: "1",
      title: "Dark mode",
      icon: isDark ? "moon" : "moon-outline",
      action: null,
      showArrow: false,
      isSwitch: true,
      switchValue: isDark,
      onSwitchChange: toggleTheme,
    },
    {
      id: "2",
      title: "Theme",
      icon: "color-palette-outline",
      action: () => {
        Alert.alert(
          "Choose Theme",
          "Select your preferred theme",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Light", 
              onPress: () => setThemeMode('light'),
              style: themeMode === 'light' ? 'default' : 'cancel'
            },
            { 
              text: "Dark", 
              onPress: () => setThemeMode('dark'),
              style: themeMode === 'dark' ? 'default' : 'cancel'
            },
            { 
              text: "System", 
              onPress: () => setThemeMode('system'),
              style: themeMode === 'system' ? 'default' : 'cancel'
            },
          ]
        );
      },
      showArrow: true,
    },
    {
      id: "3",
      title: "Help",
      icon: "help-circle-outline",
      action: () => console.log("Help"),
      showArrow: true,
    },
    {
      id: "4",
      title: "Privacy policy",
      icon: "shield-checkmark-outline",
      action: () => console.log("Privacy policy"),
      showArrow: true,
    },
    {
      id: "5",
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
          color={item.isDestructive ? colors.error : colors.textSecondary}
        />
        <StyledText
          variant="body"
          weight="medium"
          style={[
            styles.menuItemTitle,
            { color: item.isDestructive ? colors.error : colors.text },
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
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.buttonText}
        />
      ) : item.showArrow ? (
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: colors.background }]}>
          {isLoggedIn ? (
            <>
              <Image
                source={{
                  uri: user?.photoURL || `https://avatar.iran.liara.run/public/boy?username=${user?.email?.split('@')[0] || 'User'}`,
                }}
                style={styles.profileImage}
              />
              <StyledText variant="title" weight="bold" style={[styles.profileName, { color: colors.text }]}>
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </StyledText>
              {user?.email && (
                <StyledText variant="body" style={[styles.userEmail, { color: colors.textSecondary }]}>
                  {user.email}
                </StyledText>
              )}
              <TouchableOpacity style={styles.editProfileButton}>
                <StyledText
                  variant="body"
                  weight="medium"
                  style={[styles.editProfileText, { color: colors.primary }]}
                >
                  Edit profile {">"}
                </StyledText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={[styles.guestProfileImage, { backgroundColor: colors.surface }]}>
                <Ionicons name="person" size={40} color={colors.textSecondary} />
              </View>
              <StyledText variant="title" weight="bold" style={[styles.profileName, { color: colors.text }]}>
                Welcome to Lani Eats!
              </StyledText>
              <StyledText variant="body" style={[styles.guestSubtitle, { color: colors.textSecondary }]}>
                Sign in to access your profile and order history
              </StyledText>
              <View style={styles.authButtons}>
                <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.primary }]} onPress={loginHandler}>
                  <StyledText
                    variant="body"
                    weight="medium"
                    style={[styles.loginButtonText, { color: colors.buttonText }]}
                  >
                    Login
                  </StyledText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.signupButton, { borderColor: colors.primary }]} onPress={signupHandler}>
                  <StyledText
                    variant="body"
                    weight="medium"
                    style={[styles.signupButtonText, { color: colors.primary }]}
                  >
                    Sign Up
                  </StyledText>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
          {profileMenuItems.map((item) => (
            <View key={item.id}>
              {renderMenuItem({ item })}
              {item.id !== profileMenuItems[profileMenuItems.length - 1].id && (
                <View style={[styles.menuDivider, { backgroundColor: colors.divider }]} />
              )}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.myDefinedColors.background,
    marginTop: StatusBar.currentHeight,
  },
  profileSection: {
    backgroundColor: Colors.myDefinedColors.background,
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
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  menuSection: {
    backgroundColor: Colors.myDefinedColors.white,
    // marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 8,
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
  guestProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  guestSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  authButtons: {
    flexDirection: "row",
    gap: 12,
  },
  loginButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  signupButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "600",
  },
});
