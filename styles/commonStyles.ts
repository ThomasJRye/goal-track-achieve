import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#E0F2FE',     // Calming light blue
  primaryDark: '#0891B2', // Darker blue for accents
  secondary: '#F0F9FF',   // Very light blue
  accent: '#4CAF50',      // Green for progress
  danger: '#F44336',      // Red for deadlines
  warning: '#FF9800',     // Orange for warnings
  background: '#FFFFFF',  // White background
  backgroundAlt: '#F8FAFC', // Light gray background
  surface: '#FFFFFF',     // White surface
  text: '#334155',        // Dark gray text
  textSecondary: '#64748B', // Medium gray text
  textLight: '#94A3B8',   // Light gray text
  border: '#E2E8F0',      // Light border
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const shadows = {
  small: {
    boxShadow: `0 1px 3px ${colors.shadow}`,
    elevation: 2,
  },
  medium: {
    boxShadow: `0 4px 6px ${colors.shadow}`,
    elevation: 4,
  },
  large: {
    boxShadow: `0 10px 15px ${colors.shadow}`,
    elevation: 8,
  },
};

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  button: {
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.bodyMedium,
    color: colors.surface,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
});

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primaryDark,
  },
  secondary: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  success: {
    backgroundColor: colors.accent,
  },
  danger: {
    backgroundColor: colors.danger,
  },
});