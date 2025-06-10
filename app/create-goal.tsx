import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Goal, GoalCategory, Milestone } from '../types/Goal';
import { goalStorage } from '../utils/storage';
import { colors, spacing, typography, commonStyles, borderRadius } from '../styles/commonStyles';

export default function CreateGoalScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<GoalCategory[]>([]);
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [milestones, setMilestones] = useState<Omit<Milestone, 'id' | 'completed' | 'completedAt'>[]>([]);
  const [newMilestone, setNewMilestone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const savedCategories = await goalStorage.getCategories();
    setCategories(savedCategories);
    if (savedCategories.length > 0) {
      setCategory(savedCategories[0].name);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    setLoading(true);

    try {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        category,
        targetDate: targetDate.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: 0,
        status: 'active',
        priority,
        milestones: milestones.map((milestone, index) => ({
          ...milestone,
          id: `${Date.now()}_${index}`,
          completed: false,
        })),
      };

      await goalStorage.addGoal(newGoal);
      router.back();
    } catch (error) {
      console.error('Error saving goal:', error);
      Alert.alert('Error', 'Failed to save goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addMilestone = () => {
    if (!newMilestone.trim()) return;

    setMilestones([
      ...milestones,
      {
        title: newMilestone.trim(),
        description: '',
      },
    ]);
    setNewMilestone('');
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Create Goal</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveButton, loading && styles.disabledButton]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Goal Title *</Text>
          <TextInput
            style={commonStyles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter your goal title"
            placeholderTextColor={colors.textLight}
            maxLength={100}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[commonStyles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your goal in detail..."
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    category === cat.name && styles.activeCategoryButton,
                    { borderColor: cat.color },
                  ]}
                  onPress={() => setCategory(cat.name)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat.name && styles.activeCategoryText,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Priority */}
        <View style={styles.section}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityContainer}>
            {(['low', 'medium', 'high'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityButton,
                  priority === p && styles.activePriorityButton,
                ]}
                onPress={() => setPriority(p)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    priority === p && styles.activePriorityText,
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Target Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Target Date *</Text>
          <TouchableOpacity
            style={[commonStyles.input, styles.dateButton]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {targetDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <Text style={styles.label}>Milestones (Optional)</Text>
          <View style={styles.milestoneInputContainer}>
            <TextInput
              style={[commonStyles.input, styles.milestoneInput]}
              value={newMilestone}
              onChangeText={setNewMilestone}
              placeholder="Add a milestone..."
              placeholderTextColor={colors.textLight}
              onSubmitEditing={addMilestone}
            />
            <TouchableOpacity style={styles.addButton} onPress={addMilestone}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {milestones.map((milestone, index) => (
            <View key={index} style={styles.milestoneItem}>
              <Text style={styles.milestoneText}>{milestone.title}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeMilestone(index)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={targetDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setTargetDate(selectedDate);
            }
          }}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    ...typography.bodyMedium,
    color: colors.primaryDark,
  },
  saveButton: {
    ...typography.bodyMedium,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  disabledButton: {
    color: colors.textLight,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textArea: {
    height: 100,
    paddingTop: spacing.md,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  categoryText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  activeCategoryText: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  activePriorityButton: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  priorityText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  activePriorityText: {
    color: colors.surface,
  },
  dateButton: {
    justifyContent: 'center',
  },
  dateText: {
    ...typography.body,
    color: colors.text,
  },
  milestoneInputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  milestoneInput: {
    flex: 1,
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '600',
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  milestoneText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  removeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: '600',
  },
});