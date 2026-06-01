import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DayPlan, UserStats, TopicMastery, AnalyticsData, ReflectionLog, MockInterview, CustomTask, BacklogItem } from '../lib/types';
import { generateRoadmap, generateInitialTopics } from '../lib/data/seed';

export interface AiSubtopic {
  id: string;
  title: string;
  completed: boolean;
}

export interface AiModule {
  id: string;
  domainId: string;
  title: string;
  subtopics: AiSubtopic[];
}

export interface DailyHabit {
  id: string;
  title: string;
}

export interface LongTermGoal {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

interface AppState {
  roadmap: DayPlan[];
  stats: UserStats;
  topicMastery: Record<string, TopicMastery>;
  analytics: AnalyticsData;
  reflections: ReflectionLog[];
  mockInterviews: MockInterview[];
  interviewNotes: Record<string, { rating: number, notes: string }>;
  projectDrafts: Record<string, string>;
  customTasks: Record<string, CustomTask[]>;
  backlogItems: BacklogItem[];
  
  // Actions
  completeTask: (dayNumber: number, taskId: string) => void;
  addReflection: (log: ReflectionLog) => void;
  addMockInterview: (mock: MockInterview) => void;
  recalculateReadiness: () => void;
  updateTopicMastery: (topicId: string, updates: Partial<TopicMastery>) => void;
  updateInterviewNote: (question: string, rating: number, notes: string) => void;
  updateProjectDraft: (project: string, draft: string) => void;
  
  // Custom Task Actions
  addCustomTask: (date: string, text: string) => void;
  toggleCustomTask: (date: string, taskId: string) => void;
  deleteCustomTask: (date: string, taskId: string) => void;

  // Backlog Actions
  addBacklogItem: (item: Omit<BacklogItem, 'id' | 'createdAt'>) => void;
  updateBacklogItem: (id: string, updates: Partial<BacklogItem>) => void;
  deleteBacklogItem: (id: string) => void;

  setCurrentDay: (dayNumber: number) => void;

  // AI Curriculum
  aiModules: AiModule[];
  toggleAiSubtopic: (moduleId: string, subtopicId: string) => void;
  addAiModule: (domainId: string, title: string) => void;
  addAiSubtopic: (moduleId: string, title: string) => void;
  deleteAiModule: (id: string) => void;
  deleteAiSubtopic: (moduleId: string, subtopicId: string) => void;

  // Daily Habits
  dailyHabits: DailyHabit[];
  addDailyHabit: (title: string) => void;
  deleteDailyHabit: (id: string) => void;

  // Long Term Goals
  longTermGoals: LongTermGoal[];
  addLongTermGoal: (title: string) => void;
  toggleLongTermGoal: (id: string) => void;
  deleteLongTermGoal: (id: string) => void;
}

const initialAiModules: AiModule[] = [
  // Deep Learning Domain
  {
    id: 'mod-ann',
    domainId: 'dl',
    title: 'Artificial Neural Networks (ANN)',
    subtopics: [
      { id: 'sub-ann-1', title: 'Customer Churn Prediction (ANN Classification)', completed: false },
      { id: 'sub-ann-2', title: 'Handwritten Digit Classification (MNIST)', completed: false },
      { id: 'sub-ann-3', title: 'Graduate Admission Prediction (Regression)', completed: false },
      { id: 'sub-ann-4', title: 'Vanishing & Exploding Gradients Debugging', completed: false },
      { id: 'sub-ann-5', title: 'Implementing Dropout Layers', completed: false },
      { id: 'sub-ann-6', title: 'Batch Normalization', completed: false },
      { id: 'sub-ann-7', title: 'Hyperparameter Tuning with Keras Tuner', completed: false },
      { id: 'sub-ann-8', title: 'Keras Functional Model API', completed: false }
    ]
  },
  {
    id: 'mod-cnn',
    domainId: 'dl',
    title: 'Convolutional Neural Networks (CNN)',
    subtopics: [
      { id: 'sub-cnn-1', title: 'Cat Vs Dog Image Classification Project', completed: false },
      { id: 'sub-cnn-2', title: 'Implementing Pretrained CNN Models (ImageNet)', completed: false },
      { id: 'sub-cnn-3', title: 'Transfer Learning & Fine Tuning', completed: false }
    ]
  },
  {
    id: 'mod-rnn',
    domainId: 'dl',
    title: 'Recurrent Neural Networks (RNN & LSTM)',
    subtopics: [
      { id: 'sub-rnn-1', title: 'RNN Implementation for Sentiment Analysis', completed: false },
      { id: 'sub-rnn-2', title: 'Building a Next Word Predictor (LSTM)', completed: false }
    ]
  },
  {
    id: 'mod-transformers',
    domainId: 'dl',
    title: 'Transformers & Attention',
    subtopics: [
      { id: 'sub-trans-1', title: 'Programming Self Attention Mechanisms', completed: false }
    ]
  },
  
  // Machine Learning Domain
  {
    id: 'mod-ml-basics',
    domainId: 'ml',
    title: 'Supervised Learning',
    subtopics: [
      { id: 'sub-ml-1', title: 'Linear & Logistic Regression', completed: false },
      { id: 'sub-ml-2', title: 'Decision Trees & Random Forests', completed: false },
      { id: 'sub-ml-3', title: 'SVM & Kernels', completed: false }
    ]
  },
  
  // Generative AI Domain
  {
    id: 'mod-genai-llm',
    domainId: 'genai',
    title: 'Large Language Models',
    subtopics: [
      { id: 'sub-genai-1', title: 'LLM Architectures', completed: false },
      { id: 'sub-genai-2', title: 'Retrieval-Augmented Generation (RAG)', completed: false }
    ]
  },
  
  // Agentic AI Domain
  {
    id: 'mod-agentic-react',
    domainId: 'agentic',
    title: 'Agent Frameworks',
    subtopics: [
      { id: 'sub-agent-1', title: 'ReAct Prompting & Planning', completed: false },
      { id: 'sub-agent-2', title: 'Tool Calling & Function Execution', completed: false }
    ]
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      roadmap: generateRoadmap(),
      stats: {
        currentDay: 1,
        streak: 0,
        readinessScore: 0,
        lastActiveDate: null,
        missionStartDate: new Date().toISOString().split('T')[0],
      },
      topicMastery: generateInitialTopics(),
      analytics: {
        studyHoursByDay: {},
        readinessHistory: {},
      },
      reflections: [],
      mockInterviews: [],
      interviewNotes: {},
      projectDrafts: {},
      customTasks: {},
      backlogItems: [],

      recalculateReadiness: () => set((state) => {
        // Readiness Algorithm
        let dsaSum = 0; let dsaCount = 0;
        let mlSum = 0; let mlCount = 0;
        
        Object.values(state.topicMastery).forEach(t => {
          if (t.category === 'DSA') { dsaSum += t.confidenceScore; dsaCount++; }
          if (t.category === 'ML/DL') { mlSum += t.confidenceScore; mlCount++; }
        });

        const dsaAvg = dsaCount > 0 ? dsaSum / dsaCount : 0;
        const mlAvg = mlCount > 0 ? mlSum / mlCount : 0;

        let projTotal = 0; let projCompleted = 0;
        state.roadmap.forEach(day => {
          day.tasks.filter(t => t.category === 'Projects').forEach(t => {
            projTotal++;
            if (t.status === 'Completed') projCompleted++;
          });
        });
        const projScore = projTotal > 0 ? (projCompleted / projTotal) * 100 : 0;

        let mockSum = 0; const mockCount = state.mockInterviews.length;
        state.mockInterviews.forEach(m => { mockSum += m.confidenceRating * 10; }); // scale to 100
        const mockScore = mockCount > 0 ? mockSum / mockCount : 0;

        // Weighted Average
        const finalScore = Math.round((dsaAvg * 0.3) + (mlAvg * 0.3) + (projScore * 0.2) + (mockScore * 0.2));

        return {
          stats: { ...state.stats, readinessScore: finalScore },
          analytics: {
            ...state.analytics,
            readinessHistory: { ...state.analytics.readinessHistory, [state.stats.currentDay]: finalScore }
          }
        };
      }),

      completeTask: (dayNumber, taskId) => {
        const state = get();
        let foundTopicId: string | undefined;
        let impact = 0;
        let durationMins = 0;
        let wasCompleted = false;

        // 1. Mark task as completed (toggle)
        const newRoadmap = state.roadmap.map(day => {
          if (day.dayNumber === dayNumber) {
            return {
              ...day,
              tasks: day.tasks.map(task => {
                if (task.id === taskId) {
                  wasCompleted = task.status === 'Completed';
                  foundTopicId = task.topicId;
                  impact = task.confidenceImpact || 0;
                  durationMins = task.durationMinutes;
                  return { ...task, status: (wasCompleted ? 'Pending' : 'Completed') as 'Pending' | 'Completed' | 'Failed' | 'Skipped' };
                }
                return task;
              })
            };
          }
          return day;
        });

        // 2. Update Topic Mastery (increment on complete, decrement on un-complete)
        const newTopicMastery = { ...state.topicMastery };
        if (foundTopicId && newTopicMastery[foundTopicId]) {
          const t = newTopicMastery[foundTopicId];
          if (!wasCompleted) {
            newTopicMastery[foundTopicId] = {
              ...t,
              solvedCount: Math.min(t.totalQuestions, t.solvedCount + 1),
              confidenceScore: Math.min(100, t.confidenceScore + impact),
              lastRevisionDay: state.stats.currentDay,
            };
          } else {
            newTopicMastery[foundTopicId] = {
              ...t,
              solvedCount: Math.max(0, t.solvedCount - 1),
              confidenceScore: Math.max(0, t.confidenceScore - impact),
            };
          }
        }

        // 3. Update Analytics (Hours) — add on complete, subtract on un-complete
        const newAnalytics = { ...state.analytics };
        const hours = durationMins / 60;
        if (!wasCompleted) {
          newAnalytics.studyHoursByDay[state.stats.currentDay] = (newAnalytics.studyHoursByDay[state.stats.currentDay] || 0) + hours;
        } else {
          newAnalytics.studyHoursByDay[state.stats.currentDay] = Math.max(0, (newAnalytics.studyHoursByDay[state.stats.currentDay] || 0) - hours);
        }

        // 4. Update Streak — track consecutive active days
        const today = new Date().toISOString().split('T')[0];
        const lastActive = state.stats.lastActiveDate;
        let newStreak = state.stats.streak;
        if (!wasCompleted) {
          if (lastActive === today) {
            // Already active today, streak stays
          } else if (lastActive) {
            const lastDate = new Date(lastActive);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            newStreak = diffDays === 1 ? newStreak + 1 : 1;
          } else {
            newStreak = 1;
          }
        }

        set({ 
          roadmap: newRoadmap, 
          topicMastery: newTopicMastery, 
          analytics: newAnalytics,
          stats: { ...state.stats, streak: newStreak, lastActiveDate: !wasCompleted ? today : state.stats.lastActiveDate }
        });
        get().recalculateReadiness();
      },

      addReflection: (log) => set((state) => ({ reflections: [...state.reflections, log] })),
      addMockInterview: (mock) => set((state) => {
        const newMocks = [...state.mockInterviews, mock];
        return { mockInterviews: newMocks };
      }),
      updateTopicMastery: (topicId, updates) => set((state) => {
        const newTopicMastery = { ...state.topicMastery };
        if (newTopicMastery[topicId]) {
          newTopicMastery[topicId] = { ...newTopicMastery[topicId], ...updates };
        }
        return { topicMastery: newTopicMastery };
      }),
      updateInterviewNote: (question, rating, notes) => set((state) => ({
        interviewNotes: {
          ...state.interviewNotes,
          [question]: { rating, notes }
        }
      })),
      updateProjectDraft: (project, draft) => set((state) => ({
        projectDrafts: {
          ...state.projectDrafts,
          [project]: draft
        }
      })),

      addCustomTask: (date, text) => set((state) => {
        const newTask: CustomTask = {
          id: `ct-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text,
          completed: false,
          date,
          createdAt: Date.now(),
        };
        const existingTasks = state.customTasks[date] || [];
        return {
          customTasks: {
            ...state.customTasks,
            [date]: [...existingTasks, newTask],
          }
        };
      }),

      toggleCustomTask: (date, taskId) => set((state) => {
        const tasks = state.customTasks[date] || [];
        const updatedTasks = tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return {
          customTasks: {
            ...state.customTasks,
            [date]: updatedTasks,
          }
        };
      }),

      deleteCustomTask: (date, taskId) => set((state) => {
        const tasks = state.customTasks[date] || [];
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        return {
          customTasks: {
            ...state.customTasks,
            [date]: updatedTasks,
          }
        };
      }),

      addBacklogItem: (item) => set((state) => {
        const newItem: BacklogItem = {
          ...item,
          id: `bl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
        };
        return {
          backlogItems: [...state.backlogItems, newItem],
        };
      }),

      updateBacklogItem: (id, updates) => set((state) => {
        const updatedItems = state.backlogItems.map(item => 
          item.id === id ? { ...item, ...updates } : item
        );
        return {
          backlogItems: updatedItems,
        };
      }),

      deleteBacklogItem: (id) => set((state) => {
        const updatedItems = state.backlogItems.filter(item => item.id !== id);
        return {
          backlogItems: updatedItems,
        };
      }),

      setCurrentDay: (dayNumber) => set((state) => {
        if (dayNumber < 1 || dayNumber > 50) return state;

        const newRoadmap = [...state.roadmap];
        const dayPlanIndex = newRoadmap.findIndex(d => d.dayNumber === dayNumber);
        
        if (dayPlanIndex !== -1) {
          const dayTasks = newRoadmap[dayPlanIndex].tasks;
          // Check if habits were already injected
          const hasHabits = dayTasks.some(t => t.id.startsWith('habit-'));
          
          if (!hasHabits && state.dailyHabits.length > 0) {
            state.dailyHabits.forEach(habit => {
              newRoadmap[dayPlanIndex].tasks.push({
                id: `habit-${dayNumber}-${habit.id}-${Date.now()}`,
                title: habit.title,
                description: 'Daily Minimum',
                category: 'Chore',
                durationMinutes: 15,
                difficulty: 'Easy',
                priority: 1,
                status: 'Pending',
                failedCount: 0
              });
            });
          }
        }

        return { 
          stats: { ...state.stats, currentDay: dayNumber },
          roadmap: newRoadmap
        };
      }),

      aiModules: initialAiModules,
      
      toggleAiSubtopic: (moduleId, subtopicId) => set((state) => ({
        aiModules: state.aiModules.map(mod => mod.id === moduleId ? {
          ...mod,
          subtopics: mod.subtopics.map(sub => sub.id === subtopicId ? { ...sub, completed: !sub.completed } : sub)
        } : mod)
      })),

      addAiModule: (domainId, title) => set((state) => ({
        aiModules: [...state.aiModules, { id: `mod-${Date.now()}`, domainId, title, subtopics: [] }]
      })),

      addAiSubtopic: (moduleId, title) => set((state) => ({
        aiModules: state.aiModules.map(mod => mod.id === moduleId ? {
          ...mod,
          subtopics: [...mod.subtopics, { id: `sub-${Date.now()}`, title, completed: false }]
        } : mod)
      })),

      deleteAiModule: (id) => set((state) => ({
        aiModules: state.aiModules.filter(mod => mod.id !== id)
      })),

      deleteAiSubtopic: (moduleId, subtopicId) => set((state) => ({
        aiModules: state.aiModules.map(mod => mod.id === moduleId ? {
          ...mod,
          subtopics: mod.subtopics.filter(sub => sub.id !== subtopicId)
        } : mod)
      })),

      dailyHabits: [],
      addDailyHabit: (title) => set((state) => ({
        dailyHabits: [...state.dailyHabits, { id: `habit-${Date.now()}`, title }]
      })),
      deleteDailyHabit: (id) => set((state) => ({
        dailyHabits: state.dailyHabits.filter(h => h.id !== id)
      })),

      longTermGoals: [],
      addLongTermGoal: (title) => set((state) => ({
        longTermGoals: [...state.longTermGoals, { id: `ltg-${Date.now()}`, title, completed: false, createdAt: Date.now() }]
      })),
      toggleLongTermGoal: (id) => set((state) => ({
        longTermGoals: state.longTermGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g)
      })),
      deleteLongTermGoal: (id) => set((state) => ({
        longTermGoals: state.longTermGoals.filter(g => g.id !== id)
      })),

    }),
    {
      name: 'internx50-storage-v3', // new key for new schema
    }
  )
);
