import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Goal, Milestone } from '../types/Goal';
import { goalStorage } from '../utils/storage';
import { colors, spacing, typography, commonStyles, borderRadius } from '../styles/commonStyles';
import { formatDate, formatRelativeDate, isOverdue } from '../utils/dateUtils';
import ProgressBar from '../components/ProgressBar';

export default function GoalDetailScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProgress, setEditedProgress] = useState('');

  useEffect(() => {
    if (goalId) {
      loadGoal();
    }
  }, [goalId]);

  const loadGoal = async () => {
    try {
      const goals = await goalStorage.getGoals();
      const foundGoal = goals.find(g => g.id === goalId);
      if (foundGoal) {
        setGoal(foundGoal);
        setEditedProgress(foundGoal.progress.toString());
      } else {
        Alert.alert('Error', 'Goal not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading goal:', error);
      Alert.alert('Error', 'Failed to load goal');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async () => {
    if (!goal) return;

    const newProgress = Math.max(0, Math.min(100, parseInt(editedProgress) || 0));
    const updatedGoal: Goal = {
      ...goal,
      progress: newProgress,
      status: newProgress === 100 ? 'completed' : 'active',
      updatedAt: new Date().toISOString(),
    };

    try {
      await goalStorage.updateGoal(updatedGoal);
      setGoal(updatedGoal);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  const toggleMilestone = async (milestoneId: string) => {
    if (!goal) return;

    const updatedMilestones = goal.milestones.map(milestone => {
      if (milestone.id === milestoneId) {
        return {
          ...milestone,
          completed: !milestone.completed,
          completedAt: !milestone.completed ? new Date().toISOString() : undefined,
        };
      }
      return milestone;
    });

    const completedMilestones = updatedMilestones.filter(m => m.completed).length;
    const totalMilestones = updatedMilestones.length;
    const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
    
    const updatedGoal: Goal = {
      ...goal,
      milestones: updatedMilestones,
      progress: Math.max(goal.progress, Math.round(milestoneProgress)),
      updatedAt: new Date().toISOString(),
    };

    try {
      await goalStorage.updateGoal(updatedGoal);
      setGoal(updatedGoal);
    } catch (error) {
      console.error('Error updating milestone:', error);
      Alert.alert('Error', 'Failed to update milestone');
    }
  };

  const deleteGoal = async () => {
    if (!goal) return;

    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await goalStorage.deleteGoal(goal.id);
              router.back();
            } catch (error) {
              console.error('Error deleting goal:', error);
              Alert.alert('Error', 'Failed to delete goal');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading goal...</Text>
      </View>
    );
  }

  if (!goal) {
    return (
      <View style={[commonStyles.container, styles.centered]}>
        <Text style={styles.errorText}>Goal not found</Text>
      </View>
    );
  }

  const overdue = isOverdue(goal.targetDate);
  const statusColor = goal.status === 'completed' ? colors.accent : overdue ? colors.danger : colors.primaryDark;

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Goal Details</Text>
        <TouchableOpacity onPress={deleteGoal}>
          <Text style={styles.deleteButton}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Goal Header */}
        <View style={[styles.headerCard, { borderLeftColor: statusColor }]}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={[styles.status, { color: statusColor }]}>
              {goal.status.toUpperCase()}
            </Text>
          </View>
          
          {goal.description && (
            <Text style={styles.description}>{goal.description}</Text>
          )}

          <View style={styles.metaInfo}>
            <Text style={styles.category}>{goal.category}</Text>
            <Text style={styles.priority}>
              {goal.priority === 'high' ? '🔴' : goal.priority === 'medium' ? '🟡' : '🟢'} 
              {' '}{goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
            </Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progress</Text>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.progressEditContainer}>
              <TextInput
                style={styles.progressInput}
                value={editedProgress}
                onChangeText={setEditedProgress}
                placeholder="0-100"
                keyboardType="numeric"
                maxLength={3}
              />
              <TouchableOpacity style={styles.updateButton} onPress={updateProgress}>
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.progressContainer}>
              <ProgressBar progress={goal.progress} color={statusColor} />
              <Text style={styles.progressText}>{goal.progress}%</Text>
            </View>
          )}
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>Created:</Text>
            <Text style={styles.timelineValue}>{formatDate(goal.createdAt)}</Text>
          </View>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>Target Date:</Text>
            <Text style={[
              styles.timelineValue,
              { color: overdue ? colors.danger : colors.text }
            ]}>
              {formatDate(goal.targetDate)} ({formatRelativeDate(goal.targetDate)})
            </Text>
          </View>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>Last Updated:</Text>
            <Text style={styles.timelineValue}>{formatDate(goal.updatedAt)}</Text>
          </View>
        </View>

        {/* Milestones */}
        {goal.milestones.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
            </Text>
            {goal.milestones.map((milestone) => (
              <TouchableOpacity
                key={milestone.id}
                style={styles.milestoneItem}
                onPress={() => toggleMilestone(milestone.id)}
              >
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneCheckbox}>
                    {milestone.completed ? '✅' : '⬜'}
                  </Text>
                  <View style={styles.milestoneText}>
                    <Text style={[
                      styles.milestoneTitle,
                      milestone.completed && styles.completedText
                    ]}>
                      {milestone.title}
                    </Text>
                    {milestone.completed && milestone.completedAt && (
                      <Text style={styles.completedDate}>
                        Completed {formatDate(milestone.completedAt)}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.body,
    color: colors.danger,
  },
  backButton: {
    ...typography.bodyMedium,
    color: colors.primaryDark,
  },
  deleteButton: {
    fontSize: 20,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  goalTitle: {
    ...typography.h2,
    color: colors.text,
    flex: 1,
    marginRight: spacing.md,
  },
  status: {
    ...typography.caption,
    fontWeight: '600',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  metaInfo: {
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
  priority: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  editButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.sm,
  },
  editButtonText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  progressEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  updateButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  updateButtonText: {
    color: colors.surface,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressText: {
    ...typography.h3,
    color: colors.text,
    minWidth: 50,
  },
  timelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timelineLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  timelineValue: {
    ...typography.body,
    color: colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
  milestoneItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  milestoneContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  milestoneCheckbox: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  milestoneText: {
    flex: 1,
  },
  milestoneTitle: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  completedDate: {
    ...typography.small,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
});