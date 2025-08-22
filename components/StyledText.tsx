import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface StyledTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'button' | 'largeTitle';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
}

export default function StyledText({ 
  children, 
  style, 
  variant = 'body',
  weight = 'bold',
  ...props 
}: StyledTextProps) {
  const getFontFamily = () => {
    switch (weight) {
      case 'light':
        return 'BricolageGrotesque-Light';
      case 'regular':
        return 'BricolageGrotesque-Regular';
      case 'medium':
        return 'BricolageGrotesque-Medium';
      case 'semibold':
        return 'BricolageGrotesque-SemiBold';
      case 'bold':
        return 'BricolageGrotesque_24pt-Bold';
      case 'extrabold':
        return 'BricolageGrotesque-ExtraBold';
      default:
        return 'BricolageGrotesque_24pt-Bold';
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'largeTitle':
        return styles.largeTitle;
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'body':
        return styles.body;
      case 'caption':
        return styles.caption;
      case 'button':
        return styles.button;
      default:
        return styles.body;
    }
  };

  return (
    <Text 
      style={[
        styles.base,
        getVariantStyle(),
        { fontFamily: getFontFamily() },
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: '#1A1A1A',
  },
  largeTitle: {
    fontSize: 24,
    lineHeight: 32,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
  },
});
