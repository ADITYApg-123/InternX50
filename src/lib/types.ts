export type TaskCategory = 'DSA' | 'GATE' | 'ML/DL' | 'Projects' | 'Communication' | 'OA/Mock' | 'Fundamentals';
export type TaskDifficulty = 'Easy' | 'Medium' | 'Hard';
export type TaskStatus = 'Pending' | 'Completed' | 'Skipped' | 'Failed';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  durationMinutes: number;
  difficulty: TaskDifficulty;
  priority: number; // 1 (Highest) to 5 (Lowest)
  status: TaskStatus;
  topicId?: string; // Links to TopicMastery
  confidenceImpact?: number; // How much it affects the topic confidence (+ or -)
  failedCount: number;
  isRevision?: boolean;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  phase: number;
  tasks: Task[];
  date?: string; // Keep track of physical dates if needed
}

export interface TopicMastery {
  topicId: string;
  name: string;
  category: TaskCategory;
  solvedCount: number;
  totalQuestions: number;
  confidenceScore: number; // 0 to 100
  lastRevisionDay: number | null;
  weakPatterns: string[];
}

export interface ReflectionLog {
  dayNumber: number;
  date: string;
  energyLevel: 'High' | 'Medium' | 'Low' | 'Burnout';
  blockers: string;
  revisionNeeds: string;
  notes: string;
}

export interface MockInterview {
  id: string;
  date: string;
  companyOrType: string;
  confidenceRating: number; // 0 to 10
  passed: boolean;
  feedback: string;
}

export interface AnalyticsData {
  studyHoursByDay: Record<number, number>; // dayNumber -> hours
  readinessHistory: Record<number, number>; // dayNumber -> score
}

export interface UserStats {
  currentDay: number;
  streak: number;
  readinessScore: number;
  lastActiveDate: string | null;
  missionStartDate: string | null;
}

export interface Roadmap {
  days: DayPlan[];
}

export interface CustomTask {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export type BacklogItemType = 'Work' | 'Target' | 'Project';
export type BacklogItemStatus = 'Todo' | 'In Progress' | 'Done';

export interface BacklogItem {
  id: string;
  title: string;
  description?: string;
  type: BacklogItemType;
  status: BacklogItemStatus;
  createdAt: number;
}
