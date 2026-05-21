'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { Activity, Clock, Code2, Calculator, Bug, Play, RotateCcw, X, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useState, useEffect } from 'react';
import { useOaStore } from '@/store/useOaStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function OASimulationPage() {
  const { oaResults, addOaResult, deleteOaResult } = useOaStore();
  
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes
  const [isActive, setIsActive] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [company, setCompany] = useState('');
  const [score, setScore] = useState(0);
  const [totalQ, setTotalQ] = useState(4);
  const [passed, setPassed] = useState(false);
  const [timeSpent, setTimeSpent] = useState(90);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  if (!mounted) return null;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveMock = () => {
    if (!company.trim()) return;
    
    addOaResult({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      company: company.trim(),
      score,
      totalQuestions: totalQ,
      passed,
      timeSpent
    });

    // Reset form
    setCompany('');
    setScore(0);
    setTotalQ(4);
    setPassed(false);
    setTimeSpent(90);
    setShowForm(false);
  };

  // Compute analytics dynamically
  const totalMocks = oaResults.length;
  const passedMocks = oaResults.filter(r => r.passed).length;
  const accuracyRate = totalMocks > 0 ? Math.round((passedMocks / totalMocks) * 100) : 0;
  
  let totalMinutes = 0;
  let totalQuestionsSolved = 0;
  oaResults.forEach(r => {
    totalMinutes += r.timeSpent;
    totalQuestionsSolved += r.totalQuestions;
  });
  
  const avgSpeed = totalQuestionsSolved > 0 ? Math.round(totalMinutes / totalQuestionsSolved) : 0;

  const isTimeUp = timeLeft === 0;

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

          <div className={`flex items-center gap-4 bg-white/5 border px-4 py-2 rounded-lg transition-colors ${isTimeUp ? 'border-red-500/50 bg-red-500/10' : 'border-white/10'}`}>
            <Clock className={`h-5 w-5 ${isTimeUp ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
            
            {isTimeUp ? (
              <span className="text-2xl font-black text-red-500 animate-pulse w-24 text-center tracking-wider">TIME UP</span>
            ) : (
              <span className="text-2xl font-mono font-bold w-24 text-center">{formatTime(timeLeft)}</span>
            )}
            
            <div className="h-6 w-px bg-white/10 mx-2" />
            
            <button 
              onClick={() => {
                if (isTimeUp) {
                  setTimeLeft(90 * 60);
                } else {
                  setIsActive(!isActive);
                }
              }}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {isActive ? <span className="text-sm font-bold tracking-wider">PAUSE</span> : <Play className="h-5 w-5 fill-current" />}
            </button>
            
            <button 
              onClick={() => { setIsActive(false); setTimeLeft(90 * 60); }}
              className="text-zinc-400 hover:text-white transition-colors ml-2"
              title="Reset Timer"
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
              <div className="text-3xl font-bold text-emerald-500">
                {avgSpeed} <span className="text-lg font-normal text-emerald-500/50">mins/Q</span>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Accuracy Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{accuracyRate}%</div>
            </CardContent>
          </Card>
          <Card className="glass border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Mock OAs Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalMocks}</div>
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Historical Performance</h2>
              {!showForm && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-dashed border-white/20 text-zinc-300 hover:bg-white/5 hover:text-white transition-all font-medium"
                >
                  + Log New Result
                </button>
              )}
            </div>
            
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="glass p-5 rounded-xl border border-white/10 space-y-4 mb-6 bg-black/40">
                    <h3 className="font-semibold text-sm">Log OA Result</h3>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400">Company / OA Name</label>
                      <input 
                        type="text" 
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Amazon Mock OA"
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 flex justify-between">
                        <span>Score Percentage</span>
                        <span>{score}%</span>
                      </label>
                      <Slider 
                        max={100} 
                        step={5} 
                        value={[score]}
                        onValueChange={(val) => setScore((val as number[])[0])}
                        className="py-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-400">Total Questions</label>
                        <input 
                          type="number" 
                          min="1"
                          value={totalQ}
                          onChange={(e) => setTotalQ(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-400">Time Spent (mins)</label>
                        <input 
                          type="number" 
                          min="1"
                          value={timeSpent}
                          onChange={(e) => setTimeSpent(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400">Result</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setPassed(true)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${passed ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                        >
                          Cleared
                        </button>
                        <button 
                          onClick={() => setPassed(false)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${!passed ? "bg-red-500/20 text-red-400 border-red-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                        >
                          Failed
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => setShowForm(false)}
                        className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveMock}
                        disabled={!company.trim()}
                        className="flex-1 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" /> Save
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {oaResults.length === 0 ? (
                <div className="text-center p-8 glass border border-white/5 rounded-xl text-zinc-500">
                  <Activity className="h-8 w-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No OA results logged yet.</p>
                  <p className="text-xs mt-1">Start a simulation and log your result here.</p>
                </div>
              ) : (
                oaResults.map((oa) => (
                  <div key={oa.id} className="group glass p-4 rounded-xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        {oa.company}
                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-zinc-400">
                          {oa.totalQuestions} Qs / {oa.timeSpent}m
                        </span>
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">{oa.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold font-mono">{oa.score}%</div>
                        <div className={`text-xs ${oa.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                          {oa.passed ? 'Cleared' : 'Failed'}
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteOaResult(oa.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-all"
                        title="Delete log"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {oaResults.length === 0 && !showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="w-full py-4 rounded-xl border border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all font-medium"
              >
                + Log First Mock OA Result
              </button>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
