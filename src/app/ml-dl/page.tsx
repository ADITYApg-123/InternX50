'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { 
  BrainCircuit, ChevronRight, BookOpen, Layers, Zap, Cpu
} from 'lucide-react';
import Link from 'next/link';

const DOMAINS = [
  { id: 'ml', title: 'Machine Learning (ML)', description: 'Supervised, Unsupervised, and classical algorithms.', icon: BookOpen, color: 'text-emerald-400' },
  { id: 'dl', title: 'Deep Learning (DL)', description: 'Neural networks, computer vision, and NLP architecture.', icon: Layers, color: 'text-blue-500' },
  { id: 'genai', title: 'Generative AI', description: 'LLMs, RAG, and prompt engineering.', icon: Zap, color: 'text-amber-400' },
  { id: 'agentic', title: 'Agentic AI', description: 'Agents, tool calling, and planning.', icon: Cpu, color: 'text-purple-400' },
];

export default function MldlRootPage() {
  const [mounted, setMounted] = useState(false);
  const { aiModules } = useStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6 text-zinc-100 bg-[#020202] min-h-screen">
        
        {/* Header Section */}
        <div className="glass rounded-2xl p-6 border-white/5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none" />
          
          <div className="space-y-2 text-center md:text-left z-10 w-full">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <BrainCircuit className="text-blue-500 h-9 w-9 animate-pulse" />
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                AI Curriculum
              </h1>
            </div>
            <p className="text-sm text-zinc-400 max-w-lg">
              Track your practical implementation mastery across key Artificial Intelligence domains. Select a domain below to view modules.
            </p>
          </div>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DOMAINS.map(domain => {
            const domainModules = aiModules.filter(m => m.domainId === domain.id);
            
            let totalSubtopics = 0;
            let completedSubtopics = 0;
            
            domainModules.forEach(mod => {
              totalSubtopics += mod.subtopics.length;
              completedSubtopics += mod.subtopics.filter(s => s.completed).length;
            });
            
            const progress = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;
            const Icon = domain.icon;

            return (
              <Link key={domain.id} href={`/ml-dl/${domain.id}`} className="block group">
                <div className="glass rounded-xl border border-white/5 overflow-hidden flex flex-col shadow-lg h-full hover:bg-white/[0.02] transition-colors relative">
                  
                  <div className="p-6 flex flex-col h-full justify-between gap-6">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="font-bold text-xl text-zinc-200 flex items-center gap-3">
                          <Icon className={`h-6 w-6 ${domain.color}`} />
                          {domain.title}
                        </h2>
                        <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-sm text-zinc-400">
                        {domain.description}
                      </p>
                    </div>
                    
                    <div className="space-y-2 mt-auto">
                      <div className="flex justify-between text-xs text-zinc-400 mb-1">
                        <span>Overall Progress</span>
                        <span className="font-mono">
                          {completedSubtopics} / {totalSubtopics} ({progress}%)
                        </span>
                      </div>
                      <Progress value={progress} className="h-2 bg-white/5 w-full" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
