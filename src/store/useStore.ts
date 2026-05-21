import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DayPlan, UserStats, TopicMastery, AnalyticsData, ReflectionLog, MockInterview, Task } from '../lib/types';
import { generateRoadmap, generateInitialTopics } from '../lib/data/seed';

interface AppState {
  roadmap: DayPlan[];
  stats: UserStats;
  topicMastery: Record<string, TopicMastery>;
  analytics: AnalyticsData;
  reflections: ReflectionLog[];
  mockInterviews: MockInterview[];
  
  // Actions
  completeTask: (dayNumber: number, taskId: string) => void;
  triggerDailyCron: (newDay: number) => void;
  addReflection: (log: ReflectionLog) => void;
  addMockInterview: (mock: MockInterview) => void;
  recalculateReadiness: () => void;
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
      },
      topicMastery: generateInitialTopics(),
      analytics: {
        studyHoursByDay: {},
        readinessHistory: {},
      },
      reflections: [],
      mockInterviews: [],

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

        // 1. Mark task as completed
        const newRoadmap = state.roadmap.map(day => {
          if (day.dayNumber === dayNumber) {
            return {
              ...day,
              tasks: day.tasks.map(task => {
                if (task.id === taskId) {
                  foundTopicId = task.topicId;
                  impact = task.confidenceImpact || 0;
                  durationMins = task.durationMinutes;
                  return { ...task, status: (task.status === 'Completed' ? 'Pending' : 'Completed') as 'Pending' | 'Completed' | 'Failed' | 'Skipped' };
                }
                return task;
              })
            };
          }
          return day;
        });

        // 2. Update Topic Mastery
        const newTopicMastery = { ...state.topicMastery };
        if (foundTopicId && newTopicMastery[foundTopicId]) {
          const t = newTopicMastery[foundTopicId];
          newTopicMastery[foundTopicId] = {
            ...t,
            solvedCount: t.solvedCount + 3,
            confidenceScore: Math.min(100, t.confidenceScore + impact),
            lastRevisionDay: state.stats.currentDay,
          };
        }

        // 3. Update Analytics (Hours)
        const newAnalytics = { ...state.analytics };
        const hours = durationMins / 60;
        newAnalytics.studyHoursByDay[state.stats.currentDay] = (newAnalytics.studyHoursByDay[state.stats.currentDay] || 0) + hours;

        set({ roadmap: newRoadmap, topicMastery: newTopicMastery, analytics: newAnalytics });
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

    }),
    {
      name: 'internx50-storage-v2', // new key for new schema
    }
  )
);
