import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingSplash from '@/components/OnboardingSplash';
import LoadingScreen from '@/components/LoadingScreen';

export default function OnboardingScreen() {
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
      if (onboardingComplete === 'true') {
        // User has already completed onboarding, go to main app
        router.replace('/(tabs)');
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Error checking onboarding status:', error);
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      // Mark onboarding as complete
      await AsyncStorage.setItem('onboardingComplete', 'true');
      setIsComplete(true);
      // Navigate to home screen
      router.replace('/(tabs)');
    } catch (error) {
      console.log('Error saving onboarding status:', error);
      // Still navigate even if saving fails
      router.replace('/(tabs)');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <OnboardingSplash onComplete={handleOnboardingComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
