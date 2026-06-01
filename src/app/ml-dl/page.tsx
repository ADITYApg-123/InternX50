'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BrainCircuit, CheckCircle2, Circle, Plus, Trash2, Code2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MldlPrepPage() {
  const [mounted, setMounted] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newSubtopicTitles, setNewSubtopicTitles] = useState<Record<string, string>>({});
  
  const { 
    aiModules, toggleAiSubtopic, addAiModule, addAiSubtopic, deleteAiModule, deleteAiSubtopic 
  } = useStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    addAiModule(newModuleTitle.trim());
    setNewModuleTitle('');
  };

  const handleAddSubtopic = (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    const title = newSubtopicTitles[moduleId];
    if (!title?.trim()) return;
    addAiSubtopic(moduleId, title.trim());
    setNewSubtopicTitles(prev => ({ ...prev, [moduleId]: '' }));
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-6 text-zinc-100 bg-[#020202] min-h-screen">
        
        {/* Header Section */}
        <div className="glass rounded-2xl p-6 border-white/5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none" />
          
          <div className="space-y-2 text-center md:text-left z-10 w-full">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <BrainCircuit className="text-blue-500 h-9 w-9 animate-pulse" />
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                AI & Deep Learning Curriculum
              </h1>
            </div>
            <p className="text-sm text-zinc-400 max-w-lg">
              Track your practical implementation mastery across key Artificial Intelligence domains.
            </p>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-6">
          {aiModules.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No modules created yet. Add one below to start learning.
            </div>
          ) : (
            aiModules.map(module => {
              const total = module.subtopics.length;
              const completed = module.subtopics.filter(s => s.completed).length;
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
              
              return (
                <div key={module.id} className="glass rounded-xl border border-white/5 overflow-hidden">
                  {/* Module Header */}
                  <div className="p-5 border-b border-white/5 bg-zinc-950/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group">
                    <div className="space-y-1.5 w-full">
                      <div className="flex items-center justify-between w-full">
                        <h2 className="font-bold text-lg text-zinc-200 flex items-center gap-2">
                          <Code2 className="h-5 w-5 text-blue-500" />
                          {module.title}
                        </h2>
                        <button 
                          onClick={() => deleteAiModule(module.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={progress} className="h-2 bg-white/5 w-full sm:w-48" />
                        <span className="text-xs font-mono text-zinc-400 min-w-[50px]">{completed} / {total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtopics List */}
                  <div className="divide-y divide-white/5">
                    {module.subtopics.length === 0 ? (
                      <div className="p-4 text-xs text-zinc-600 italic">No subtopics yet.</div>
                    ) : (
                      module.subtopics.map(sub => (
                        <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                          <button 
                            onClick={() => toggleAiSubtopic(module.id, sub.id)}
                            className="flex items-center gap-3 text-left focus:outline-none flex-1"
                          >
                            {sub.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-zinc-600 shrink-0 group-hover:text-blue-400 transition-colors" />
                            )}
                            <span className={cn(
                              "text-sm transition-colors",
                              sub.completed ? "text-zinc-500 line-through" : "text-zinc-300"
                            )}>
                              {sub.title}
                            </span>
                          </button>
                          
                          <button 
                            onClick={() => deleteAiSubtopic(module.id, sub.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all shrink-0 ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                    
                    {/* Add Subtopic Input */}
                    <div className="p-3 bg-black/20">
                      <form onSubmit={(e) => handleAddSubtopic(e, module.id)} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add new subtopic..."
                          value={newSubtopicTitles[module.id] ?? ''}
                          onChange={(e) => setNewSubtopicTitles(prev => ({ ...prev, [module.id]: e.target.value }))}
                          className="w-full bg-transparent border border-white/5 rounded-md px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50"
                        />
                        <button type="submit" disabled={!newSubtopicTitles[module.id]?.trim()} className="p-1.5 rounded-md bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors">
                          <Plus className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Add Module Input */}
          <Card className="bg-transparent border border-dashed border-white/10 hover:border-white/20 transition-colors">
            <CardContent className="p-4">
              <form onSubmit={handleAddModule} className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white/5 text-zinc-400 shrink-0">
                  <Plus className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Create a new Module (e.g. Generative AI, MLOps...)"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  className="w-full bg-transparent border-none px-2 py-2 text-sm text-zinc-300 focus:outline-none"
                />
                <button 
                  type="submit" 
                  disabled={!newModuleTitle.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  Add Module
                </button>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </PageTransition>
  );
}
