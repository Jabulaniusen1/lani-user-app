import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession } from '../auth/ctx';
import LoadingScreen from '../components/LoadingScreen';

export default function IndexScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useSession();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
      
      if (onboardingComplete === 'true') {
        // User has completed onboarding, go to main app (home page)
        // Users can view the home page without being logged in
        router.replace('/(tabs)');
      } else {
        // First time user, show onboarding
        router.replace('/onboarding');
      }
    } catch (error) {
      console.log('Error checking onboarding status:', error);
      // On error, show onboarding as fallback
      router.replace('/onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
