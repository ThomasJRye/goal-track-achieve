import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, shadows } from '../styles/commonStyles';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = '+',
}) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  icon: {
    fontSize: 24,
    color: colors.surface,
    fontWeight: '600',
  },
});

export default FloatingActionButton;