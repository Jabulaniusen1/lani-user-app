import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text, View } from '@/components/Themed';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const profileMenuItems = [
    {
      id: '1',
      title: 'Personal Information',
      icon: 'person-outline',
      action: () => console.log('Personal Information'),
      showArrow: true
    },
    {
      id: '2',
      title: 'Addresses',
      icon: 'location-outline',
      action: () => console.log('Addresses'),
      showArrow: true
    },
    {
      id: '3',
      title: 'Payment Methods',
      icon: 'card-outline',
      action: () => console.log('Payment Methods'),
      showArrow: true
    },
    {
      id: '4',
      title: 'Notifications',
      icon: 'notifications-outline',
      action: null,
      showArrow: false,
      isSwitch: true,
      switchValue: notificationsEnabled,
      onSwitchChange: setNotificationsEnabled
    },
    {
      id: '5',
      title: 'Dark Mode',
      icon: 'moon-outline',
      action: null,
      showArrow: false,
      isSwitch: true,
      switchValue: darkModeEnabled,
      onSwitchChange: setDarkModeEnabled
    },
    {
      id: '6',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      action: () => console.log('Help & Support'),
      showArrow: true
    },
    {
      id: '7',
      title: 'About',
      icon: 'information-circle-outline',
      action: () => console.log('About'),
      showArrow: true
    },
    {
      id: '8',
      title: 'Logout',
      icon: 'log-out-outline',
      action: () => router.push('/auth/login'),
      showArrow: false,
      isDestructive: true
    }
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
          color={item.isDestructive ? '#FF3B30' : '#666'} 
        />
        <Text style={[
          styles.menuItemTitle,
          item.isDestructive && styles.menuItemTitleDestructive
        ]}>
          {item.title}
        </Text>
      </View>
      
      {item.isSwitch ? (
        <Switch
          value={item.switchValue}
          onValueChange={item.onSwitchChange}
          trackColor={{ false: '#E0E0E0', true: '#FF6B35' }}
          thumbColor={item.switchValue ? '#FFFFFF' : '#FFFFFF'}
        />
      ) : item.showArrow ? (
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image 
          source={require('@/assets/images/laanieats-logo.png')} 
          style={styles.profileImage} 
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Annie Johnson</Text>
          <Text style={styles.profileEmail}>annie.johnson@email.com</Text>
          <Text style={styles.profilePhone}>+234 801 234 5678</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Ionicons name="create-outline" size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>₦45,200</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
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

      {/* App Version */}
      <View style={styles.versionSection}>
        <Text style={styles.versionText}>Lani Eats v1.0.0</Text>
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
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 16,
    color: '#666',
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingVertical: 24,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 16,
    fontWeight: '500',
  },
  menuItemTitleDestructive: {
    color: '#FF3B30',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 60,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});
