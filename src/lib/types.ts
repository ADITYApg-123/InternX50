export type TaskCategory = 'DSA' | 'GATE' | 'ML/DL' | 'Projects' | 'Communication' | 'OA/Mock' | 'Fundamentals';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  durationMinutes: number;
  completed: boolean;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  phase: number;
  tasks: Task[];
}

export interface Roadmap {
  days: DayPlan[];
}

export interface UserStats {
  currentDay: number;
  streak: number;
  readinessScore: number;
}
