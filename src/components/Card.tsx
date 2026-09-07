import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

interface CardProps {
  children: ReactNode;
  style?: any;
  variant?: 'default' | 'accent' | 'outlined';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'default' }) => {
  return (
    <View
      style={[
        styles.card,
        variant === 'accent' && styles.cardAccent,
        variant === 'outlined' && styles.cardOutlined,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  cardAccent: {
    backgroundColor: Colors.primary,
    borderColor: Colors.borderGold,
  },
  cardOutlined: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },
});
