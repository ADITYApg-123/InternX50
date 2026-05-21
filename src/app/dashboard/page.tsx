'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { useStore } from '@/store/useStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, PlayCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { roadmap, stats, triggerDailyCron } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentDayPlan = roadmap.find(d => d.dayNumber === stats.currentDay);
  const remainingDays = 50 - stats.currentDay;
  
  const completedToday = currentDayPlan?.tasks.filter(t => t.status === 'Completed').length || 0;
  const totalToday = currentDayPlan?.tasks.length || 1;
  const progressPercent = Math.round((completedToday / totalToday) * 100);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DSA': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'ML/DL': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'GATE': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Projects': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Communication': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
      case 'OA/Mock': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mission Dashboard</h1>
            <p className="text-zinc-400 mt-1">Stay consistent. Every day counts.</p>
          </div>
          <div className="glass px-4 py-2 rounded-lg flex items-center gap-4 border-white/10">
            <div className="text-sm">
              <span className="text-zinc-400">Countdown:</span>
              <span className="ml-2 font-mono font-bold text-lg text-white">{remainingDays} Days Left</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass border-white/5 bg-black/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Current Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Day {stats.currentDay}</div>
            </CardContent>
          </Card>
          <Card className="glass border-white/5 bg-black/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Daily Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="text-3xl font-bold">{progressPercent}%</div>
                <Progress value={progressPercent} className="h-1 bg-white/10" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-white/5 bg-black/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500 flex items-center gap-2">
                {stats.streak} <span className="text-lg text-orange-500/50">Days</span>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-white/5 bg-black/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Readiness Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-400">{stats.readinessScore}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Today&apos;s Mission</h2>
              {progressPercent === 100 && (
                <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4" /> All tasks completed
                </div>
              )}
            </div>
            
            <div className="grid gap-3">
              {currentDayPlan?.tasks.map(task => {
                const isCompleted = task.status === 'Completed';
                return (
                <div 
                  key={task.id}
                  className={cn(
                    "glass p-4 rounded-xl border flex items-start gap-4 transition-all duration-300",
                    isCompleted ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/5 hover:border-white/20"
                  )}
                >
                  <Checkbox 
                    checked={isCompleted}
                    onCheckedChange={() => useStore.getState().completeTask(stats.currentDay, task.id)}
                    className={cn("mt-1 w-5 h-5 rounded border-white/20", isCompleted && "data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500")}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={cn("font-medium", isCompleted && "line-through text-zinc-500")}>
                        {task.title}
                      </p>
                      <span className={cn("text-xs px-2 py-0.5 rounded-md border", getCategoryColor(task.category))}>
                        {task.category}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">{task.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs font-medium text-zinc-500">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.durationMinutes} mins</span>
                    </div>
                  </div>
                </div>
              )})}
            </div>

            <div className="pt-4 flex justify-between">
              <button 
                disabled={stats.currentDay === 1}
                onClick={() => triggerDailyCron(stats.currentDay - 1)}
                className="text-sm text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
              >
                ← Previous Day
              </button>
              <button 
                disabled={stats.currentDay === 50}
                onClick={() => triggerDailyCron(stats.currentDay + 1)}
                className="text-sm text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
              >
                Next Day →
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Upcoming Milestones</h2>
            <div className="glass rounded-xl border border-white/5 p-4 space-y-4">
              <div className="flex gap-4 opacity-50">
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Phase 2: Projects</h4>
                  <p className="text-xs text-zinc-400 mt-1">Unlocks at Day 13</p>
                </div>
              </div>
              <div className="flex gap-4 opacity-50">
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Phase 3: Interviews</h4>
                  <p className="text-xs text-zinc-400 mt-1">Unlocks at Day 31</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
