import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Goal } from '../types/Goal';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/commonStyles';
import { formatRelativeDate, isOverdue, getDaysUntilDeadline } from '../utils/dateUtils';
import ProgressBar from './ProgressBar';

interface GoalCardProps {
  goal: Goal;
  onPress: () => void;
  onLongPress?: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onPress, onLongPress }) => {
  const overdue = isOverdue(goal.targetDate);
  const daysUntil = getDaysUntilDeadline(goal.targetDate);
  const isUrgent = daysUntil <= 7 && daysUntil > 0;

  const getStatusColor = () => {
    if (goal.status === 'completed') return colors.accent;
    if (overdue) return colors.danger;
    if (isUrgent) return colors.warning;
    return colors.primaryDark;
  };

  const getPriorityIndicator = () => {
    switch (goal.priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: getStatusColor() }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {goal.title}
          </Text>
          <Text style={styles.priority}>{getPriorityIndicator()}</Text>
        </View>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {goal.status.toUpperCase()}
        </Text>
      </View>

      {goal.description && (
        <Text style={styles.description} numberOfLines={2}>
          {goal.description}
        </Text>
      )}

      <View style={styles.progressContainer}>
        <ProgressBar progress={goal.progress} color={getStatusColor()} />
        <Text style={styles.progressText}>{goal.progress}%</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.category}>{goal.category}</Text>
        <Text style={[
          styles.deadline,
          { color: overdue ? colors.danger : isUrgent ? colors.warning : colors.textSecondary }
        ]}>
          {formatRelativeDate(goal.targetDate)}
        </Text>
      </View>

      {goal.milestones.length > 0 && (
        <View style={styles.milestonesContainer}>
          <Text style={styles.milestonesText}>
            {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    ...shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  priority: {
    fontSize: 16,
  },
  status: {
    ...typography.caption,
    fontWeight: '600',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    minWidth: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    ...typography.caption,
    color: colors.primaryDark,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  deadline: {
    ...typography.caption,
    fontWeight: '500',
  },
  milestonesContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  milestonesText: {
    ...typography.small,
    color: colors.textLight,
  },
});

export default GoalCard;