import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Goal } from '../types/Goal';
import { goalStorage } from '../utils/storage';
import { colors, spacing, typography, commonStyles, borderRadius } from '../styles/commonStyles';

export default function ProfileScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const savedGoals = await goalStorage.getGoals();
      setGoals(savedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your goals and data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await goalStorage.saveGoals([]);
              setGoals([]);
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  const getStatistics = () => {
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => g.status === 'active').length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const averageProgress = totalGoals > 0 
      ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals)
      : 0;

    const categoryStats = goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    return {
      totalGoals,
      activeGoals,
      completedGoals,
      averageProgress,
      categoryStats,
      completionRate,
    };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Profile</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
            <Text style={styles.userName}>Goal Tracker User</Text>
            <Text style={styles.userSubtitle}>Long-term Goal Enthusiast</Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalGoals}</Text>
              <Text style={styles.statLabel}>Total Goals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completedGoals}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completionRate}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.averageProgress}%</Text>
              <Text style={styles.statLabel}>Avg Progress</Text>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        {Object.keys(stats.categoryStats).length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Goals by Category</Text>
            {Object.entries(stats.categoryStats).map(([category, count]) => (
              <View key={category} style={styles.categoryRow}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryCount}>{count} goal{count !== 1 ? 's' : ''}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Achievements */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          <View style={styles.achievementContainer}>
            {stats.completedGoals >= 1 && (
              <View style={styles.achievement}>
                <Text style={styles.achievementIcon}>🎯</Text>
                <Text style={styles.achievementText}>First Goal Completed</Text>
              </View>
            )}
            
            {stats.completedGoals >= 5 && (
              <View style={styles.achievement}>
                <Text style={styles.achievementIcon}>🏆</Text>
                <Text style={styles.achievementText}>Goal Achiever (5+ goals)</Text>
              </View>
            )}
            
            {stats.completedGoals >= 10 && (
              <View style={styles.achievement}>
                <Text style={styles.achievementIcon}>⭐</Text>
                <Text style={styles.achievementText}>Goal Master (10+ goals)</Text>
              </View>
            )}
            
            {stats.completionRate >= 80 && stats.totalGoals >= 3 && (
              <View style={styles.achievement}>
                <Text style={styles.achievementIcon}>💪</Text>
                <Text style={styles.achievementText}>High Achiever (80%+ success)</Text>
              </View>
            )}

            {Object.keys(stats.categoryStats).length === 0 && (
              <Text style={styles.noAchievements}>
                Complete your first goal to unlock achievements! 🎉
              </Text>
            )}
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={clearAllData}>
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
          <Text style={styles.warningText}>
            This will permanently delete all your goals and cannot be undone.
          </Text>
        </View>

        {/* App Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Goal Tracker helps you set, track, and achieve your long-term goals. 
            Break down big dreams into manageable milestones and watch your progress grow over time.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>

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
  backButton: {
    ...typography.bodyMedium,
    color: colors.primaryDark,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  avatar: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  userName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundAlt,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h2,
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  categoryCount: {
    ...typography.body,
    color: colors.textSecondary,
  },
  achievementContainer: {
    gap: spacing.md,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  achievementText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  noAchievements: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dangerButton: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dangerButtonText: {
    ...typography.bodyMedium,
    color: colors.surface,
    fontWeight: '600',
  },
  warningText: {
    ...typography.small,
    color: colors.textLight,
    textAlign: 'center',
  },
  aboutText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  versionText: {
    ...typography.small,
    color: colors.textLight,
    textAlign: 'center',
  },
});