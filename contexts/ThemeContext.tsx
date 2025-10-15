import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryDark: string;
  primaryLight: string;
  
  // Background colors
  background: string;
  surface: string;
  card: string;
  modal: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Border and divider colors
  border: string;
  divider: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Interactive colors
  button: string;
  buttonText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  
  // Input colors
  input: string;
  inputBorder: string;
  inputFocus: string;
  placeholder: string;
  
  // Tab bar colors
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  
  // Shadow colors
  shadow: string;
  
  // Rating and special colors
  rating: string;
  price: string;
  delivery: string;
}

const lightTheme: ThemeColors = {
  // Primary colors
  primary: '#FF6B35',
  primaryDark: '#E55A2B',
  primaryLight: '#FF8A65',
  
  // Background colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',
  modal: 'rgba(0, 0, 0, 0.5)',
  
  // Text colors
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
  
  // Border and divider colors
  border: '#E0E0E0',
  divider: '#F0F0F0',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Interactive colors
  button: '#FF6B35',
  buttonText: '#FFFFFF',
  buttonSecondary: '#FFFFFF',
  buttonSecondaryText: '#FF6B35',
  
  // Input colors
  input: '#FFFFFF',
  inputBorder: '#FF6B35',
  inputFocus: '#FF6B35',
  placeholder: '#999999',
  
  // Tab bar colors
  tabBar: '#FFFFFF',
  tabBarActive: '#FF6B35',
  tabBarInactive: '#999999',
  
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Rating and special colors
  rating: '#FFD700',
  price: '#4CAF50',
  delivery: '#4CAF50',
};

const darkTheme: ThemeColors = {
  // Primary colors
  primary: '#FF6B35',
  primaryDark: '#E55A2B',
  primaryLight: '#FF8A65',
  
  // Background colors
  background: '#121212',
  surface: '#1E1E1E',
  card: '#2D2D2D',
  modal: 'rgba(0, 0, 0, 0.8)',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#808080',
  textInverse: '#1A1A1A',
  
  // Border and divider colors
  border: '#404040',
  divider: '#333333',
  
  // Status colors
  success: '#66BB6A',
  warning: '#FFB74D',
  error: '#EF5350',
  info: '#42A5F5',
  
  // Interactive colors
  button: '#FF6B35',
  buttonText: '#FFFFFF',
  buttonSecondary: '#2D2D2D',
  buttonSecondaryText: '#FF6B35',
  
  // Input colors
  input: '#2D2D2D',
  inputBorder: '#FF6B35',
  inputFocus: '#FF6B35',
  placeholder: '#808080',
  
  // Tab bar colors
  tabBar: '#1E1E1E',
  tabBarActive: '#FF6B35',
  tabBarInactive: '#808080',
  
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.3)',
  
  // Rating and special colors
  rating: '#FFD700',
  price: '#66BB6A',
  delivery: '#66BB6A',
};

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update dark mode based on theme mode
  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(deviceColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, deviceColorScheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const colors = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    colors,
    isDark,
    themeMode,
    setThemeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
