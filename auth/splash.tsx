import * as SplashScreen from 'expo-splash-screen';
import { useSession } from './ctx';
import { useEffect } from 'react';

export function SplashScreenController() {
  const { isLoading } = useSession();

  useEffect(() => {
    // Keep splash screen visible while loading
    if (!isLoading) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return null;
}
