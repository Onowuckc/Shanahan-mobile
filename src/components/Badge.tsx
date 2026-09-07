import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'muted';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'gold', icon, style }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return { bg: Colors.successBg, color: Colors.success, border: Colors.success };
      case 'warning':
        return { bg: Colors.warningBg, color: Colors.warning, border: Colors.warning };
      case 'danger':
        return { bg: Colors.dangerBg, color: Colors.danger, border: Colors.danger };
      case 'info':
        return { bg: Colors.infoBg, color: Colors.info, border: Colors.info };
      case 'muted':
        return { bg: Colors.bgCard, color: Colors.textMuted, border: Colors.border };
      default:
        return { bg: 'rgba(212, 175, 55, 0.15)', color: Colors.accent, border: Colors.borderGold };
    }
  };

  const currentTheme = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: currentTheme.bg, borderColor: currentTheme.border },
        style,
      ]}
    >
      {icon ? <View style={{ marginRight: 4 }}>{icon}</View> : null}
      <Text style={[styles.text, { color: currentTheme.color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
