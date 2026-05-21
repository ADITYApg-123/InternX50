'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { Rocket, GitBranch, CheckCircle2, Circle, MessageSquare, ExternalLink, Code, Database, BrainCircuit, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  const { roadmap, stats, projectDrafts, updateProjectDraft } = useStore();
  const [mounted, setMounted] = useState(false);
  const [activeDraft, setActiveDraft] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState('');

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
    id: 'core-ml-system',
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

  const secondaryProjects = [
    {
      id: 'dsa-viz',
      name: 'Algorithm Visualizer',
      type: 'DSA / Frontend',
      status: 'Planned',
      icon: Code,
      color: 'text-orange-400'
    },
    {
      id: 'data-pipe',
      name: 'Real-time Data Pipeline',
      type: 'Data Engineering',
      status: 'Idea',
      icon: Database,
      color: 'text-blue-400'
    },
    {
      id: 'nlp-agent',
      name: 'RAG Support Agent',
      type: 'NLP / Generative AI',
      status: 'In Progress',
      icon: BrainCircuit,
      color: 'text-pink-400'
    }
  ];

  const handleOpenDraft = (projectId: string) => {
    if (activeDraft === projectId) {
      setActiveDraft(null);
    } else {
      setActiveDraft(projectId);
      setDraftContent(projectDrafts[projectId] || '');
    }
  };

  const handleSaveDraft = (projectId: string) => {
    updateProjectDraft(projectId, draftContent);
    setActiveDraft(null);
  };

  const handleGitClick = () => {
    // Simulated action for the Git branch button
    alert("Repository linking will be enabled in Phase 2!");
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
          <Card className="glass border-purple-500/20 bg-[#050505]/80 flex flex-col h-full">
            <CardHeader className="pb-4 border-b border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-medium text-purple-400 mb-1">{mainProject.type}</div>
                  <CardTitle className="text-2xl font-bold">{mainProject.name}</CardTitle>
                </div>
                <button 
                  onClick={handleGitClick}
                  className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-purple-400 transition-colors"
                  title="Link Repository"
                >
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
            <CardContent className="pt-6 flex flex-col flex-1">
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3 text-zinc-300">Milestones (Unlocks with progress)</h4>
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

              <div className="mt-8 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 transition-all duration-300">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-purple-200">
                  <MessageSquare className="h-4 w-4" /> Interview STAR Prep
                </h4>
                <p className="text-xs text-purple-200/70 mt-1 mb-3">
                  Prepare your &quot;Situation, Task, Action, Result&quot; explanation for interviews.
                </p>
                
                <AnimatePresence>
                  {activeDraft === mainProject.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-3"
                    >
                      <textarea 
                        className="w-full bg-black/40 border border-purple-500/20 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-purple-500 transition-colors min-h-[120px]"
                        placeholder="S: The problem was...&#10;T: I needed to build...&#10;A: I implemented...&#10;R: The result achieved..."
                        value={draftContent}
                        onChange={(e) => setDraftContent(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => handleSaveDraft(mainProject.id)}
                          className="flex-1 py-1.5 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <Save className="h-3 w-3" /> Save Draft
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {activeDraft !== mainProject.id && (
                  <button 
                    onClick={() => handleOpenDraft(mainProject.id)}
                    className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {projectDrafts[mainProject.id] ? 'Edit Explanation Draft' : 'Draft Explanation'}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Secondary Projects List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Side Quests & Other Projects</h2>
              <button className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
                View All <ExternalLink className="h-3 w-3" />
              </button>
            </div>
            
            <div className="grid gap-4">
              {secondaryProjects.map((project) => (
                <div key={project.id} className="glass p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0", project.color)}>
                        <project.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base group-hover:text-purple-400 transition-colors">{project.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                          <span>{project.type}</span>
                          <span>•</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full border bg-white/5",
                            project.status === 'Completed' ? "border-emerald-500/20 text-emerald-400" :
                            project.status === 'In Progress' ? "border-purple-500/20 text-purple-400" :
                            "border-white/10"
                          )}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mini Draft button for secondary projects */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <AnimatePresence>
                      {activeDraft === project.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mb-3"
                        >
                          <textarea 
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-purple-500 transition-colors min-h-[80px]"
                            placeholder="Draft STAR notes..."
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                          />
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={() => handleSaveDraft(project.id)}
                              className="flex-1 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
                            >
                              Save Notes
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {activeDraft !== project.id && (
                      <button 
                        onClick={() => handleOpenDraft(project.id)}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
                      >
                        <MessageSquare className="h-3 w-3" /> 
                        {projectDrafts[project.id] ? 'Edit Notes' : 'Add Interview Notes'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-4 rounded-xl border border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all font-medium flex items-center justify-center gap-2">
              <Rocket className="h-4 w-4" /> Log New Project
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
