import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  imagePlaceholder: any;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: 'No need to step out',
    description: 'We bring your cravings to your doorstep in minutes',
    imagePlaceholder: require('../assets/images/onboarding/splash-image-1.png'),
  },
  {
    id: 2,
    title: 'Your favorite spots, all in one app',
    description: 'Order from trusted kitchens, bukas, and restaurants in Uyo.',
    imagePlaceholder: require('../assets/images/onboarding/splash-image-2.png'),
  },
  {
    id: 3,
    title: 'Safe, Simple & Affordable',
    description: 'Track your order in real-time, pay securely, and enjoy fast delivery at pocket-friendly prices.',
    imagePlaceholder: require('../assets/images/onboarding/splash-image-3.png'),
  },
  {
    id: 4,
    title: 'Ready to Start?',
    description: 'Join thousands of happy customers enjoying amazing food every day.',
    imagePlaceholder: require('../assets/images/onboarding/splash-image-4.png'),
  },
];

interface OnboardingSplashProps {
  onComplete: () => void;
}

export default function OnboardingSplash({ onComplete }: OnboardingSplashProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = async () => {
    animateButtonPress();
    
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      // Complete onboarding
      onComplete();
    }
  };

  const handleSkip = async () => {
    // Complete onboarding when skipping
    onComplete();
  };

  const handleSkipLongPress = async () => {
    // Reset onboarding status for testing
    try {
      await AsyncStorage.removeItem('onboardingComplete');
      console.log('Onboarding status reset for testing');
    } catch (error) {
      console.log('Error resetting onboarding status:', error);
    }
  };

  const renderSlide = (slide: OnboardingSlide) => (
    <View key={slide.id} style={styles.slide}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image source={slide.imagePlaceholder} style={styles.imagePlaceholder} />
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: index === currentIndex ? '#FF6B35' : '#E0E0E0' },
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff1e8" />
      
      {/* Header with Skip button */}
      {/* <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleSkip} 
          onLongPress={handleSkipLongPress}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View> */}

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingData.map(renderSlide)}
      </ScrollView>

      {/* Bottom section with dots and button */}
      <View style={styles.bottomSection}>
        {renderDots()}
        
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity 
            style={styles.downButtonsContainer} 
            onPress={handleSkip} 
            onLongPress={handleSkipLongPress}
            >
            <Text style={styles.skipButtonText}>
              {currentIndex === onboardingData.length - 1 ? 'Login' : 'Skip'}
            </Text>
            <Text style={styles.nextButtonText} onPress={handleNext}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff1e8',
    marginTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingTop: '5%' //added this to make space at the top of the scrollable splash screen
  },
  slide: {
    width,
    height: height * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 300,
    marginBottom: 40,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 13,
  },
  description: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
  imageContainer: {
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'contain',
  },
  bottomSection: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  downButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  skipButtonText: {
    color: '#FF6B35',
    fontSize: 18,
    fontWeight: '400',
    width: '50%',
    textAlign: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    width: '50%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
