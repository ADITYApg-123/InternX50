'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { BookText, Send, Calendar as CalendarIcon, Battery, Brain, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { ReflectionLog } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ReflectionPage() {
  const { stats, reflections, addReflection } = useStore();
  const [mounted, setMounted] = useState(false);
  
  const [energy, setEnergy] = useState<'High' | 'Medium' | 'Low' | 'Burnout'>('Medium');
  const [blocker, setBlocker] = useState('');
  const [revision, setRevision] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSave = () => {
    if (!notes) return;
    
    const newLog: ReflectionLog = {
      dayNumber: stats.currentDay,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      energyLevel: energy,
      blockers: blocker,
      revisionNeeds: revision,
      notes: notes,
    };
    
    addReflection(newLog);
    setBlocker('');
    setRevision('');
    setNotes('');
  };

  const recentReflections = [...reflections].reverse();

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookText className="text-emerald-500 h-8 w-8" /> Daily Reflection
          </h1>
          <p className="text-zinc-400 mt-1">Audit your day. Track your mental state. Improve tomorrow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* New Reflection Form */}
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-6">
            <h2 className="text-xl font-bold">Day {stats.currentDay} Audit</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Battery className="h-4 w-4 text-emerald-400" /> Energy Level
                </label>
                <div className="flex gap-2">
                  {(['High', 'Medium', 'Low', 'Burnout'] as const).map(level => (
                    <button 
                      key={level} 
                      onClick={() => setEnergy(level)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-xs font-medium border transition-colors focus:outline-none",
                        energy === level ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/5 hover:bg-white/10"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-orange-400" /> Biggest Blocker
                </label>
                <input 
                  type="text" 
                  value={blocker}
                  onChange={(e) => setBlocker(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. Procrastinated on DP problems..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-400" /> What needs revision?
                </label>
                <input 
                  type="text" 
                  value={revision}
                  onChange={(e) => setRevision(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. XGBoost math, Graph traversal..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Detailed Journal Entry</label>
                <textarea 
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-emerald-500 transition-colors h-32"
                  placeholder="What did you accomplish today? How confident do you feel?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button 
                onClick={handleSave}
                disabled={!notes}
                className="w-full h-12 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" /> Save Reflection
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Reflection Timeline</h2>
            
            <div className="relative border-l border-white/10 ml-3 space-y-8 pb-8">
              {recentReflections.length === 0 && (
                <div className="pl-6 text-sm text-zinc-500">No reflections yet. Complete your first day audit!</div>
              )}
              {recentReflections.map((ref, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  
                  <div className="glass p-5 rounded-xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">Day {ref.dayNumber}</h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                          <CalendarIcon className="h-3 w-3" /> {ref.date}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-zinc-500 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Energy: {ref.energyLevel}</span>
                      </div>
                    </div>
                    {ref.blockers && <p className="text-xs text-orange-400/80"><strong>Blocker:</strong> {ref.blockers}</p>}
                    {ref.revisionNeeds && <p className="text-xs text-purple-400/80"><strong>Revision:</strong> {ref.revisionNeeds}</p>}
                    <p className="text-sm text-zinc-300 leading-relaxed pt-2 border-t border-white/5">
                      &quot;{ref.notes}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
