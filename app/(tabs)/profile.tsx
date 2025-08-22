import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { View } from '@/components/Themed';
import StyledText from '@/components/StyledText';

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
        <StyledText 
          variant="body" 
          weight="medium"
          style={[
            styles.menuItemTitle,
            item.isDestructive && styles.menuItemTitleDestructive
          ]}
        >
          {item.title}
        </StyledText>
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
        <StyledText variant="title" weight="bold" style={styles.headerTitle}>
          Profile
        </StyledText>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image 
          source={require('@/assets/images/laanieats-logo.png')} 
          style={styles.profileImage} 
        />
        <View style={styles.profileInfo}>
          <StyledText variant="title" weight="bold" style={styles.profileName}>
            Annie Johnson
          </StyledText>
          <StyledText variant="body" weight="regular" style={styles.profileEmail}>
            annie.johnson@email.com
          </StyledText>
          <StyledText variant="body" weight="regular" style={styles.profilePhone}>
            +234 801 234 5678
          </StyledText>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Ionicons name="create-outline" size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <StyledText variant="subtitle" weight="bold" style={styles.statNumber}>
            24
          </StyledText>
          <StyledText variant="body" weight="regular" style={styles.statLabel}>
            Orders
          </StyledText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <StyledText variant="subtitle" weight="bold" style={styles.statNumber}>
            8
          </StyledText>
          <StyledText variant="body" weight="regular" style={styles.statLabel}>
            Favorites
          </StyledText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <StyledText variant="subtitle" weight="bold" style={styles.statNumber}>
            ₦45,200
          </StyledText>
          <StyledText variant="body" weight="regular" style={styles.statLabel}>
            Total Spent
          </StyledText>
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
        <StyledText variant="caption" weight="regular" style={styles.versionText}>
          Lani Eats v1.0.0
        </StyledText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
  },
  editProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  menuSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 12,
  },
  menuItemTitleDestructive: {
    color: '#FF3B30',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 48,
  },
  versionSection: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});
