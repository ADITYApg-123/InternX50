'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { useStore } from '@/store/useStore';
import { ChevronDown, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DayPlan } from '@/lib/types';

function DayCard({ day }: { day: DayPlan }) {
  const [isOpen, setIsOpen] = useState(false);
  const completedCount = day.tasks.filter(t => t.status === 'Completed').length;
  const isAllCompleted = completedCount === day.tasks.length;

  return (
    <div className={cn(
      "glass border transition-all duration-300 rounded-xl overflow-hidden",
      isAllCompleted ? "border-emerald-500/30" : "border-white/5"
    )}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-4">
          {isAllCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <Circle className="h-5 w-5 text-zinc-500" />
          )}
          <div className="text-left">
            <h3 className="font-bold text-lg">{day.title}</h3>
            <p className="text-xs text-zinc-400">{completedCount}/{day.tasks.length} Tasks Completed</p>
          </div>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="h-5 w-5 text-zinc-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-2 space-y-4">
              {day.tasks.map(task => (
                <div key={task.id} className="flex gap-4 p-3 rounded-lg bg-black/40 border border-white/5">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className={cn("text-sm font-medium", task.status === 'Completed' ? "text-zinc-500 line-through" : "text-white")}>
                        {task.title}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded border border-white/10 bg-white/5 text-zinc-400">
                        {task.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{task.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoadmapPage() {
  const { roadmap } = useStore();

  const phase1 = roadmap.filter(d => d.phase === 1);
  const phase2 = roadmap.filter(d => d.phase === 2);
  const phase3 = roadmap.filter(d => d.phase === 3);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">50-Day Roadmap</h1>
          <p className="text-zinc-400 mt-1">The complete masterplan to becoming internship ready.</p>
        </div>

        <div className="space-y-12">
          {/* Phase 1 */}
          <div className="space-y-4 relative">
            <div className="sticky top-16 z-10 py-2 bg-[#050505]/80 backdrop-blur-md">
              <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
                Phase 1 <span className="text-sm font-normal text-zinc-400">(Days 1-12)</span>
              </h2>
              <p className="text-sm text-zinc-400">ML/DL Rebuild & DSA Foundation</p>
            </div>
            <div className="space-y-3">
              {phase1.map(day => (
                <DayCard key={day.dayNumber} day={day} />
              ))}
            </div>
          </div>

          {/* Phase 2 */}
          <div className="space-y-4 relative">
            <div className="sticky top-16 z-10 py-2 bg-[#050505]/80 backdrop-blur-md">
              <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
                Phase 2 <span className="text-sm font-normal text-zinc-400">(Days 13-30)</span>
              </h2>
              <p className="text-sm text-zinc-400">Projects & Core Execution</p>
            </div>
            <div className="space-y-3">
              {phase2.map(day => (
                <DayCard key={day.dayNumber} day={day} />
              ))}
            </div>
          </div>

          {/* Phase 3 */}
          <div className="space-y-4 relative">
            <div className="sticky top-16 z-10 py-2 bg-[#050505]/80 backdrop-blur-md">
              <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                Phase 3 <span className="text-sm font-normal text-zinc-400">(Days 31-50)</span>
              </h2>
              <p className="text-sm text-zinc-400">Interview Conversion & Mock Rounds</p>
            </div>
            <div className="space-y-3">
              {phase3.map(day => (
                <DayCard key={day.dayNumber} day={day} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
