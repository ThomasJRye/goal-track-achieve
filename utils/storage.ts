import { Goal, GoalCategory } from '../types/Goal';

const GOALS_KEY = 'goals';
const CATEGORIES_KEY = 'categories';

// Mock AsyncStorage for web compatibility
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  async setItem(key: string, value: string): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};

export const goalStorage = {
  async getGoals(): Promise<Goal[]> {
    try {
      const goalsJson = await storage.getItem(GOALS_KEY);
      return goalsJson ? JSON.parse(goalsJson) : [];
    } catch (error) {
      console.error('Error loading goals:', error);
      return [];
    }
  },

  async saveGoals(goals: Goal[]): Promise<void> {
    try {
      await storage.setItem(GOALS_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  },

  async addGoal(goal: Goal): Promise<void> {
    const goals = await this.getGoals();
    goals.push(goal);
    await this.saveGoals(goals);
  },

  async updateGoal(updatedGoal: Goal): Promise<void> {
    const goals = await this.getGoals();
    const index = goals.findIndex(goal => goal.id === updatedGoal.id);
    if (index !== -1) {
      goals[index] = updatedGoal;
      await this.saveGoals(goals);
    }
  },

  async deleteGoal(goalId: string): Promise<void> {
    const goals = await this.getGoals();
    const filteredGoals = goals.filter(goal => goal.id !== goalId);
    await this.saveGoals(filteredGoals);
  },

  async getCategories(): Promise<GoalCategory[]> {
    try {
      const categoriesJson = await storage.getItem(CATEGORIES_KEY);
      if (categoriesJson) {
        return JSON.parse(categoriesJson);
      } else {
        // Return default categories
        const defaultCategories: GoalCategory[] = [
          { id: '1', name: 'Health & Fitness', color: '#4CAF50', icon: '💪' },
          { id: '2', name: 'Career', color: '#2196F3', icon: '💼' },
          { id: '3', name: 'Education', color: '#FF9800', icon: '📚' },
          { id: '4', name: 'Personal', color: '#9C27B0', icon: '🌟' },
          { id: '5', name: 'Financial', color: '#4CAF50', icon: '💰' },
          { id: '6', name: 'Relationships', color: '#E91E63', icon: '❤️' },
        ];
        await this.saveCategories(defaultCategories);
        return defaultCategories;
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  },

  async saveCategories(categories: GoalCategory[]): Promise<void> {
    try {
      await storage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  },
};