'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { Rocket, GitBranch, CheckCircle2, Circle, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';

export default function ProjectsPage() {
  const { roadmap, stats } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  let totalProjectTasks = 0;
  let completedProjectTasks = 0;

  roadmap.forEach(day => {
    day.tasks.filter(t => t.category === 'Projects').forEach(t => {
      totalProjectTasks++;
      if (t.status === 'Completed') completedProjectTasks++;
    });
  });

  const mainProjectProgress = totalProjectTasks > 0 ? Math.round((completedProjectTasks / totalProjectTasks) * 100) : 0;

  const mainProject = {
    name: 'Core ML/DL Portfolio Project',
    type: 'Core AI System',
    progress: mainProjectProgress,
    milestones: [
      { name: 'Dataset Pipeline Setup', completed: mainProjectProgress >= 20 },
      { name: 'Model Architecture & Training', completed: mainProjectProgress >= 40 },
      { name: 'Hyperparameter Tuning & Eval', completed: mainProjectProgress >= 60 },
      { name: 'Frontend / API Integration', completed: mainProjectProgress >= 80 },
      { name: 'Dockerization & Deployment', completed: mainProjectProgress >= 100 },
    ]
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Rocket className="text-purple-500 h-8 w-8" /> Project Tracker
          </h1>
          <p className="text-zinc-400 mt-1">Build, deploy, and prepare to defend your portfolio.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Project */}
          <Card className="glass border-purple-500/20 bg-[#050505]/80">
            <CardHeader className="pb-4 border-b border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-medium text-purple-400 mb-1">{mainProject.type}</div>
                  <CardTitle className="text-2xl font-bold">{mainProject.name}</CardTitle>
                </div>
                <button className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <GitBranch className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">Completion</span>
                  <span className="font-bold">{mainProject.progress}%</span>
                </div>
                <Progress value={mainProject.progress} className="h-2 bg-purple-500/30" />
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">Milestones (Unlocks with progress)</h4>
                <div className="space-y-3">
                  {mainProject.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {m.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-zinc-600" />
                      )}
                      <span className={m.completed ? "text-zinc-300" : "text-zinc-500"}>{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-purple-200">
                  <MessageSquare className="h-4 w-4" /> Interview STAR Prep
                </h4>
                <p className="text-xs text-purple-200/70">
                  Prepare your &quot;Situation, Task, Action, Result&quot; explanation.
                </p>
                <button className="w-full mt-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors">
                  Draft Explanation
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
