'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { BookText, Send, Calendar as CalendarIcon, Battery, Brain, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export default function ReflectionPage() {
  const [reflection, setReflection] = useState('');
  
  const recentReflections = [
    { day: 10, date: 'Oct 12', mood: 'Focused', energy: 'High', entry: 'Completed the DP standard problems. Feeling confident about knapsack variations. Still need to revise XGBoost math.' },
    { day: 9, date: 'Oct 11', mood: 'Tired', energy: 'Low', entry: 'Struggled with graphs today. Dijkstra implementation took way too long. Will revisit tomorrow.' },
  ];

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
            <h2 className="text-xl font-bold">End of Day Audit</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Battery className="h-4 w-4 text-emerald-400" /> Energy Level
                </label>
                <div className="flex gap-2">
                  {['High', 'Medium', 'Low', 'Burnout'].map(level => (
                    <button key={level} className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium border border-white/5 transition-colors focus:ring-1 focus:ring-emerald-500">
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
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. XGBoost math, Graph traversal..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Detailed Journal Entry</label>
                <textarea 
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-emerald-500 transition-colors h-32"
                  placeholder="What did you accomplish today? How confident do you feel?"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                />
              </div>

              <button className="w-full h-12 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2">
                <Send className="h-4 w-4" /> Save Reflection
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Reflection Timeline</h2>
            
            <div className="relative border-l border-white/10 ml-3 space-y-8 pb-8">
              {recentReflections.map((ref, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  
                  <div className="glass p-5 rounded-xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">Day {ref.day}</h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                          <CalendarIcon className="h-3 w-3" /> {ref.date}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 border border-white/5">{ref.mood}</span>
                        <span className="text-[10px] text-zinc-500">Energy: {ref.energy}</span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      &quot;{ref.entry}&quot;
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
