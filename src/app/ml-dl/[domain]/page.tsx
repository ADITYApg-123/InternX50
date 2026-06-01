'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { useStore } from '@/store/useStore';
import { useEffect, useState, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BrainCircuit, CheckCircle2, Circle, Plus, Trash2, Code2, ChevronDown, ChevronUp, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const DOMAIN_TITLES: Record<string, string> = {
  'ml': 'Machine Learning',
  'dl': 'Deep Learning',
  'genai': 'Generative AI',
  'agentic': 'Agentic AI'
};

export default function DomainPrepPage({ params }: { params: Promise<{ domain: string }> }) {
  const [mounted, setMounted] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newSubtopicTitles, setNewSubtopicTitles] = useState<Record<string, string>>({});
  
  const { 
    aiModules, toggleAiSubtopic, addAiModule, addAiSubtopic, deleteAiModule, deleteAiSubtopic 
  } = useStore();

  const resolvedParams = use(params);
  const domainId = resolvedParams.domain;
  const domainTitle = DOMAIN_TITLES[domainId] || 'Domain';
  
  // Filter modules for this specific domain
  const domainModules = aiModules.filter(mod => mod.domainId === domainId);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    addAiModule(domainId, newModuleTitle.trim());
    setNewModuleTitle('');
  };

  const handleAddSubtopic = (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    const title = newSubtopicTitles[moduleId];
    if (!title?.trim()) return;
    addAiSubtopic(moduleId, title.trim());
    setNewSubtopicTitles(prev => ({ ...prev, [moduleId]: '' }));
  };

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6 text-zinc-100 bg-[#020202] min-h-screen">
        
        {/* Header Section */}
        <div className="glass rounded-2xl p-6 border-white/5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 w-full">
            <div className="space-y-4 text-center md:text-left">
              <Link href="/ml-dl" className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Curriculum
              </Link>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <BrainCircuit className="text-blue-500 h-9 w-9 animate-pulse" />
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  {domainTitle} Modules
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domainModules.length === 0 ? (
            <div className="col-span-full text-center py-12 text-zinc-500 text-sm glass rounded-xl border border-white/5">
              No modules in this domain yet. Add one below to start learning.
            </div>
          ) : (
            domainModules.map(module => {
              const total = module.subtopics.length;
              const completed = module.subtopics.filter(s => s.completed).length;
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
              const isExpanded = expandedModules[module.id];
              const nextTopic = module.subtopics.find(s => !s.completed);
              
              return (
                <div key={module.id} className="glass rounded-xl border border-white/5 overflow-hidden flex flex-col shadow-lg">
                  {/* Module Header / Overview */}
                  <div 
                    className="p-5 border-b border-white/5 bg-zinc-950/50 cursor-pointer group hover:bg-zinc-900/50 transition-colors relative"
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="font-bold text-xl text-zinc-200 flex items-center gap-2">
                        <Code2 className="h-6 w-6 text-blue-500" />
                        {module.title}
                      </h2>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAiModule(module.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all"
                          title="Delete Module"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-zinc-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-zinc-400 mb-1">
                          <span>Progress</span>
                          <span className="font-mono">{completed} / {total} ({progress}%)</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-white/5 w-full" />
                      </div>
                      
                      <div className="bg-white/5 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                        <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">Up Next</p>
                        <p className="text-sm font-medium text-zinc-200 truncate">
                          {nextTopic ? nextTopic.title : "All topics completed! 🎉"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Subtopics List */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Add Module Input */}
        <Card className="bg-transparent border border-dashed border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-4">
            <form onSubmit={handleAddModule} className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/5 text-zinc-400 shrink-0">
                <Plus className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder={`Create a new module in ${domainTitle}...`}
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
    </PageTransition>
  );
}
