import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DayPlan, UserStats } from '../lib/types';
import { generateRoadmap } from '../lib/data/seed';

interface AppState {
  roadmap: DayPlan[];
  stats: UserStats;
  toggleTaskCompletion: (dayNumber: number, taskId: string) => void;
  setCurrentDay: (day: number) => void;
  updateStreak: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      roadmap: generateRoadmap(),
      stats: {
        currentDay: 1,
        streak: 0,
        readinessScore: 0,
      },
      toggleTaskCompletion: (dayNumber, taskId) =>
        set((state) => {
          const newRoadmap = state.roadmap.map((day) => {
            if (day.dayNumber === dayNumber) {
              return {
                ...day,
                tasks: day.tasks.map((task) =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task
                ),
              };
            }
            return day;
          });
          
          let totalTasks = 0;
          let completedTasks = 0;
          
          newRoadmap.forEach((day) => {
            if (day.dayNumber <= state.stats.currentDay) {
              totalTasks += day.tasks.length;
              completedTasks += day.tasks.filter((t) => t.completed).length;
            }
          });
          
          const newScore = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

          return {
            roadmap: newRoadmap,
            stats: {
              ...state.stats,
              readinessScore: newScore,
            },
          };
        }),
      setCurrentDay: (day) =>
        set((state) => ({
          stats: {
            ...state.stats,
            currentDay: day,
          },
        })),
      updateStreak: () => 
        set((state) => ({
          stats: {
            ...state.stats,
            streak: state.stats.streak + 1,
          }
        }))
    }),
    {
      name: 'internx50-storage',
    }
  )
);
