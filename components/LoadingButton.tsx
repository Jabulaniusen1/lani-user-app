import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface LoadingButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loadingColor?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function LoadingButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  loadingColor,
  variant = 'primary',
}: LoadingButtonProps) {
  const { colors } = useTheme();
  const effectiveLoadingColor = loadingColor || (variant === 'primary' ? colors.buttonText : colors.primary);
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    // Apply theme-based colors
    if (variant === 'primary') {
      baseStyle.push({ backgroundColor: colors.button });
    } else if (variant === 'secondary') {
      baseStyle.push({ backgroundColor: colors.buttonSecondary });
    } else if (variant === 'outline') {
      baseStyle.push({ 
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary
      });
    }
    
    if (isDisabled) {
      baseStyle.push({ opacity: 0.6 });
    }
    if (style) {
      baseStyle.push(style);
    }
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    // Apply theme-based text colors
    if (variant === 'primary') {
      baseStyle.push({ color: colors.buttonText });
    } else if (variant === 'secondary') {
      baseStyle.push({ color: colors.buttonSecondaryText });
    } else if (variant === 'outline') {
      baseStyle.push({ color: colors.primary });
    }
    
    if (isDisabled) {
      baseStyle.push({ opacity: 0.6 });
    }
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    return baseStyle;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        ...getButtonStyle(),
        pressed && !isDisabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={effectiveLoadingColor} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primary: {
    backgroundColor: '#FF6B35',
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FF6B35',
  },
  outlineText: {
    color: '#FF6B35',
  },
  disabledText: {
    opacity: 0.7,
  },
});
