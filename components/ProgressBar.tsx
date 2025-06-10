import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../styles/commonStyles';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
  backgroundColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.primaryDark,
  height = 8,
  backgroundColor = colors.border,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: borderRadius.sm,
  },
});

export default ProgressBar;