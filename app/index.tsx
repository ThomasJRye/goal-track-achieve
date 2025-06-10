import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Goal } from '../types/Goal';
import { goalStorage } from '../utils/storage';
import { colors, spacing, typography, commonStyles } from '../styles/commonStyles';
import GoalCard from '../components/GoalCard';
import FloatingActionButton from '../components/FloatingActionButton';

export default function HomeScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  };

  const handleGoalPress = (goal: Goal) => {
    router.push({
      pathname: '/goal-detail',
      params: { goalId: goal.id },
    });
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const getStatistics = () => {
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => g.status === 'active').length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const averageProgress = totalGoals > 0 
      ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals)
      : 0;

    return { totalGoals, activeGoals, completedGoals, averageProgress };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading your goals...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Goal Tracker</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={commonStyles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalGoals}</Text>
            <Text style={styles.statLabel}>Total Goals</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activeGoals}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.completedGoals}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.averageProgress}%</Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {(['all', 'active', 'completed'] as const).map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterTab,
                filter === filterOption && styles.activeFilterTab,
              ]}
              onPress={() => setFilter(filterOption)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === filterOption && styles.activeFilterText,
                ]}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Goals List */}
        {filteredGoals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>
              {filter === 'all' ? 'No goals yet' : `No ${filter} goals`}
            </Text>
            <Text style={styles.emptyDescription}>
              {filter === 'all'
                ? 'Start by creating your first long-term goal!'
                : `You don't have any ${filter} goals right now.`}
            </Text>
          </View>
        ) : (
          filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onPress={() => handleGoalPress(goal)}
            />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <FloatingActionButton
        onPress={() => router.push('/create-goal')}
        icon="+"
      />
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
  profileIcon: {
    fontSize: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    ...typography.h2,
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: colors.surface,
  },
  filterText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  activeFilterText: {
    color: colors.primaryDark,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});