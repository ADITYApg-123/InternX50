import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OaResult {
  id: string;
  date: string;
  company: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number; // in minutes
}

interface OaState {
  oaResults: OaResult[];
  
  addOaResult: (result: OaResult) => void;
  deleteOaResult: (id: string) => void;
}

export const useOaStore = create<OaState>()(
  persist(
    (set) => ({
      oaResults: [],
      
      addOaResult: (result) => set((state) => ({
        oaResults: [result, ...state.oaResults]
      })),
      
      deleteOaResult: (id) => set((state) => ({
        oaResults: state.oaResults.filter(r => r.id !== id)
      })),
    }),
    {
      name: 'internx50-oa-v1',
    }
  )
);
