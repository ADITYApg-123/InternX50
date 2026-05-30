import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DayPlan, UserStats, TopicMastery, AnalyticsData, ReflectionLog, MockInterview, Task, CustomTask, BacklogItem } from '../lib/types';
import { generateRoadmap, generateInitialTopics } from '../lib/data/seed';

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
  triggerDailyCron: (newDay: number) => void;
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
}

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

        let mockSum = 0; let mockCount = state.mockInterviews.length;
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

      triggerDailyCron: (newDay) => set((state) => {
        if (newDay <= state.stats.currentDay) return state;

        const newTopicMastery = { ...state.topicMastery };
        const newRoadmap = [...state.roadmap];
        const dayPlanIndex = newRoadmap.findIndex(d => d.dayNumber === newDay);
        
        if (dayPlanIndex === -1) return state;

        // 1. Revision Engine
        Object.values(newTopicMastery).forEach(topic => {
          if (topic.lastRevisionDay !== null && (newDay - topic.lastRevisionDay) >= 7) {
            // Decay confidence
            newTopicMastery[topic.topicId].confidenceScore = Math.max(0, topic.confidenceScore - 15);
            
            // Add revision task if low confidence
            if (newTopicMastery[topic.topicId].confidenceScore < 40) {
              const revTask: Task = {
                id: `rev-${newDay}-${topic.topicId}`,
                title: `Revision Needed: ${topic.name}`,
                description: `Confidence dropped. Spend 30 mins revisiting ${topic.name}.`,
                category: topic.category,
                durationMinutes: 30,
                difficulty: 'Easy',
                priority: 1,
                status: 'Pending',
                topicId: topic.topicId,
                confidenceImpact: 20,
                failedCount: 0,
                isRevision: true,
              };
              newRoadmap[dayPlanIndex].tasks.push(revTask);
            }
          }
        });

        // 2. Fall-Behind Recovery
        const prevDay = state.stats.currentDay;
        const prevDayPlan = newRoadmap.find(d => d.dayNumber === prevDay);
        
        let currentDayMinutes = newRoadmap[dayPlanIndex].tasks.reduce((acc, t) => acc + t.durationMinutes, 0);

        if (prevDayPlan) {
          prevDayPlan.tasks.forEach(task => {
            if (task.status === 'Pending' && task.priority <= 2) { // Only carry over high priority
              if (currentDayMinutes + task.durationMinutes <= 360) { // Max 6 hours limit
                newRoadmap[dayPlanIndex].tasks.push({ ...task, id: `${task.id}-carried` });
                currentDayMinutes += task.durationMinutes;
                task.status = 'Skipped'; // mark as skipped on the old day
              } else {
                task.status = 'Failed'; // failed if it can't carry over
              }
            }
          });
        }

        return {
          stats: { ...state.stats, currentDay: newDay },
          topicMastery: newTopicMastery,
          roadmap: newRoadmap,
        };
      }),

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

    }),
    {
      name: 'internx50-storage-v2', // new key for new schema
    }
  )
);
