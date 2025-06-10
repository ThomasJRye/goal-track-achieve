export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  createdAt: string;
  updatedAt: string;
  progress: number; // 0-100
  milestones: Milestone[];
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  completed: boolean;
  completedAt?: string;
}

export interface GoalCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}