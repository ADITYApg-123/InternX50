'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { Activity, Clock, Code2, Calculator, Bug, Play, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

export default function OASimulationPage() {
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Activity className="text-emerald-500 h-8 w-8" /> OA Simulator
            </h1>
            <p className="text-zinc-400 mt-1">Train for pressure. Master speed and accuracy.</p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
            <Clock className="h-5 w-5 text-emerald-400" />
            <span className="text-2xl font-mono font-bold w-24 text-center">{formatTime(timeLeft)}</span>
            <div className="h-6 w-px bg-white/10 mx-2" />
            <button 
              onClick={() => setIsActive(!isActive)}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {isActive ? <span className="text-sm font-bold">PAUSE</span> : <Play className="h-5 w-5" />}
            </button>
            <button 
              onClick={() => { setIsActive(false); setTimeLeft(90 * 60); }}
              className="text-zinc-400 hover:text-white transition-colors ml-2"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-200">Avg. Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">22 <span className="text-lg font-normal text-emerald-500/50">mins/Q</span></div>
            </CardContent>
          </Card>
          <Card className="glass border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Accuracy Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">85%</div>
            </CardContent>
          </Card>
          <Card className="glass border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Mock OAs Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">4</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Standard Simulation Template</h2>
            
            <div className="glass p-5 rounded-xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Calculator className="h-5 w-5 text-zinc-400" />
                <h3 className="font-semibold text-lg">Section 1: Aptitude</h3>
                <span className="ml-auto text-sm text-zinc-400">20 mins</span>
              </div>
              <p className="text-sm text-zinc-400">15 MCQs on quantitative aptitude, logical reasoning, and probability.</p>
              <Progress value={100} className="h-2 bg-white/10" />
            </div>

            <div className="glass p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Bug className="h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold text-lg text-emerald-100">Section 2: Debugging</h3>
                <span className="ml-auto text-sm text-emerald-400/70">15 mins</span>
              </div>
              <p className="text-sm text-emerald-100/70">Find and fix logical bugs in 5 short code snippets (C++/Java/Python).</p>
              <Progress value={60} className="h-2 bg-emerald-500/20" />
            </div>

            <div className="glass p-5 rounded-xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Code2 className="h-5 w-5 text-zinc-400" />
                <h3 className="font-semibold text-lg">Section 3: Coding</h3>
                <span className="ml-auto text-sm text-zinc-400">55 mins</span>
              </div>
              <p className="text-sm text-zinc-400">2 Coding questions (1 Medium, 1 Hard). Must pass all hidden test cases.</p>
              <Progress value={0} className="h-2 bg-white/10" />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold">Historical Performance</h2>
            
            <div className="space-y-3">
              {[
                { date: 'Oct 12', company: 'Amazon Mock OA', score: '100%', passed: true },
                { date: 'Oct 05', company: 'Uber Mock OA', score: '75%', passed: false },
                { date: 'Sep 28', company: 'Google Mock OA', score: '50%', passed: false },
              ].map((oa, i) => (
                <div key={i} className="glass p-4 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{oa.company}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{oa.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-mono">{oa.score}</div>
                    <div className={`text-xs ${oa.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                      {oa.passed ? 'Cleared' : 'Failed'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-4 rounded-xl border border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-white/40 transition-all font-medium">
              + Log New Mock OA Result
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
