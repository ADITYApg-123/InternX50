'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { Rocket, GitBranch, CheckCircle2, Circle, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function ProjectsPage() {
  const mainProject = {
    name: 'End-to-End RAG System',
    type: 'Core ML/DL Project',
    progress: 45,
    milestones: [
      { name: 'Data Pipeline & Vector DB Setup', completed: true },
      { name: 'LLM Integration & Prompt Engg.', completed: true },
      { name: 'Retrieval Optimization (HyDE, MMR)', completed: false },
      { name: 'Frontend UI & Streaming', completed: false },
      { name: 'Dockerization & Deployment', completed: false },
    ]
  };

  const supportProject = {
    name: 'Customer Churn Prediction',
    type: 'Supporting ML Project',
    progress: 100,
    milestones: [
      { name: 'EDA & Feature Engineering', completed: true },
      { name: 'Model Training (XGBoost)', completed: true },
      { name: 'Hyperparameter Tuning', completed: true },
      { name: 'API Deployment (FastAPI)', completed: true },
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
                <Progress value={mainProject.progress} className="h-2 bg-white/10" />
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">Milestones & Checklist</h4>
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
                  Prepare your &quot;Situation, Task, Action, Result&quot; explanation. Focus on why you chose the specific retrieval strategy and how you handled latency.
                </p>
                <button className="w-full mt-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors">
                  Draft Explanation
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Supporting Project */}
          <Card className="glass border-white/5 bg-[#050505]/80 opacity-80 hover:opacity-100 transition-opacity">
            <CardHeader className="pb-4 border-b border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-medium text-zinc-400 mb-1">{supportProject.type}</div>
                  <CardTitle className="text-2xl font-bold">{supportProject.name}</CardTitle>
                </div>
                <button className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">Completion</span>
                  <span className="font-bold text-emerald-400">{supportProject.progress}%</span>
                </div>
                <Progress value={supportProject.progress} className="h-2 bg-emerald-500/20" />
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">Milestones & Checklist</h4>
                <div className="space-y-3">
                  {supportProject.milestones.map((m, i) => (
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

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-zinc-300">
                  <MessageSquare className="h-4 w-4" /> Interview STAR Prep
                </h4>
                <p className="text-xs text-zinc-500">
                  Focus on how you handled class imbalance in the churn dataset and why you chose XGBoost over Random Forest.
                </p>
                <button className="w-full mt-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors">
                  Review Draft
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
