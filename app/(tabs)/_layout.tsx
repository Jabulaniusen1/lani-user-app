import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

import Colors from "../../constants/Colors";


function IoniconsTabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
   const [loaded, error] = useFonts({
    'Bricolage-24pt-bold': require("../../assets/fonts/BricolageGrotesque_24pt_Condensed-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#999",
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.myDefinedColors.tabBar,
          borderTopColor: "#fff1e8", //works for iOS
          // borderRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IoniconsTabBarIcon name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <IoniconsTabBarIcon name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <IoniconsTabBarIcon name="time" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IoniconsTabBarIcon name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
