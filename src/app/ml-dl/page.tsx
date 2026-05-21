'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { useMldlStore, useMldlMetrics, TheoryTopic, PracticeTopic, MiniTask, InterviewQuestion, DailyGoal } from '@/store/useMldlStore';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  BrainCircuit, BookOpen, PenTool, GitBranch, Search, Bookmark, BookmarkCheck,
  CheckCircle2, Circle, Clock, Plus, Trash2, Star, AlertCircle, Check, 
  RotateCcw, Save, ChevronDown, ChevronUp, TrendingUp, Award, Code2, Flame,
  FileText, MessageSquare, Terminal, HelpCircle, ShieldAlert
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';

export default function MldlPrepPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'ml-theory' | 'ml-practice' | 'dl-theory' | 'dl-practice' | 'mini-tasks' | 'interview-questions' | 'revision-queue'>('ml-theory');
  
  // Store state and actions
  const { 
    theoryTopics, practiceTopics, miniTasks, interviewQuestions, dailyGoals,
    updateTheoryTopic, updatePracticeTopic, updateMiniTask, updateInterviewQuestion, updateDailyGoal,
    addDailyGoal, deleteDailyGoal, markTheoryRevised, markPracticeDone
  } = useMldlStore();

  const metrics = useMldlMetrics();

  // Search & Filter state for Theory
  const [theorySearch, setTheorySearch] = useState('');
  const [theoryFilter, setTheoryFilter] = useState<'all' | 'completed' | 'incomplete' | 'bookmarked'>('all');
  const [theorySort, setTheorySort] = useState<'name' | 'confidence-asc' | 'confidence-desc'>('name');
  const [expandedTheoryIds, setExpandedTheoryIds] = useState<Record<string, boolean>>({});

  // Local states for edit actions in Theory cards
  const [theoryNotes, setTheoryNotes] = useState<Record<string, string>>({});
  const [theoryConf, setTheoryConf] = useState<Record<string, number>>({});

  // Search & filter state for Practice
  const [practiceSearch, setPracticeSearch] = useState('');
  const [practiceBugs, setPracticeBugs] = useState<Record<string, string>>({});
  const [practiceNotes, setPracticeNotes] = useState<Record<string, string>>({});
  const [practiceConf, setPracticeConf] = useState<Record<string, number>>({});

  // Mini task notes and github inputs
  const [taskGithub, setTaskGithub] = useState<Record<string, string>>({});
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({});

  // Interview Questions states
  const [selectedQuestionCategory, setSelectedQuestionCategory] = useState<'ML Fundamentals' | 'DL Fundamentals' | 'Practical ML' | 'Project Discussion' | 'Debugging Questions'>('ML Fundamentals');
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionNotes, setQuestionNotes] = useState<Record<string, string>>({});

  // Daily goal input
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [goalTimes, setGoalTimes] = useState<Record<string, number>>({});
  const [goalNotes, setGoalNotes] = useState<Record<string, string>>({});
  const [expandedGoalIds, setExpandedGoalIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Handler for toggle expansion
  const toggleTheoryExpanded = (id: string, initialNotes: string, initialConf: number) => {
    setExpandedTheoryIds(prev => {
      const isCurrentlyExpanded = !!prev[id];
      if (!isCurrentlyExpanded) {
        // Initialize inputs
        setTheoryNotes(n => ({ ...n, [id]: initialNotes }));
        setTheoryConf(c => ({ ...c, [id]: initialConf }));
      }
      return { ...prev, [id]: !prev[id] };
    });
  };

  // ----------------------------------------
  // DATA FILTERING & SORTING
  // ----------------------------------------
  
  // Filter & Sort Theory topics (both ML & DL depending on activeTab)
  const getFilteredTheoryTopics = (category: 'ML' | 'DL') => {
    return theoryTopics
      .filter(t => t.category === category)
      .filter(t => t.name.toLowerCase().includes(theorySearch.toLowerCase()))
      .filter(t => {
        if (theoryFilter === 'completed') return t.completed;
        if (theoryFilter === 'incomplete') return !t.completed;
        if (theoryFilter === 'bookmarked') return t.bookmarked;
        return true;
      })
      .sort((a, b) => {
        if (theorySort === 'name') return a.name.localeCompare(b.name);
        if (theorySort === 'confidence-asc') return a.confidenceScore - b.confidenceScore;
        if (theorySort === 'confidence-desc') return b.confidenceScore - a.confidenceScore;
        return 0;
      });
  };

  // Practice filtering
  const getFilteredPractice = (type: 'ML' | 'DL') => {
    // We split: first 6 are ML, last 2 are DL
    const mlIds = ['prac-preprocessing', 'prac-feature', 'prac-pipelines', 'prac-split', 'prac-metrics', 'prac-tuning'];
    const dlIds = ['prac-cnn', 'prac-pytorch'];
    
    return practiceTopics
      .filter(p => type === 'ML' ? mlIds.includes(p.id) : dlIds.includes(p.id))
      .filter(p => p.name.toLowerCase().includes(practiceSearch.toLowerCase()));
  };

  // Interview Questions filtering
  const getFilteredQuestions = () => {
    return interviewQuestions
      .filter(q => q.category === selectedQuestionCategory)
      .filter(q => q.question.toLowerCase().includes(questionSearch.toLowerCase()));
  };

  // ----------------------------------------
  // CHARTS PREPARATION
  // ----------------------------------------

  // Radar Data: Confidence ratings of 6 key representative topics
  const radarTopicIds = ['ml-linear', 'ml-xgboost', 'ml-biasvar', 'dl-cnn', 'dl-lstm', 'dl-transformers'];
  const radarData = theoryTopics
    .filter(t => radarTopicIds.includes(t.id))
    .map(t => ({
      subject: t.name,
      Confidence: t.confidenceScore,
      fullMark: 100
    }));

  // Bar Data: Completed vs Total
  const completedMlTheory = theoryTopics.filter(t => t.category === 'ML' && t.completed).length;
  const totalMlTheory = theoryTopics.filter(t => t.category === 'ML').length;

  const completedDlTheory = theoryTopics.filter(t => t.category === 'DL' && t.completed).length;
  const totalDlTheory = theoryTopics.filter(t => t.category === 'DL').length;

  const completedMlPrac = practiceTopics.filter((p, i) => i < 6 && p.completed).length;
  const totalMlPrac = 6;

  const completedDlPrac = practiceTopics.filter((p, i) => i >= 6 && p.completed).length;
  const totalDlPrac = 2;

  const completedTasks = miniTasks.filter(t => t.completed).length;
  const totalTasks = miniTasks.length;

  const barData = [
    { name: 'ML Theory', Completed: completedMlTheory, Total: totalMlTheory },
    { name: 'DL Theory', Completed: completedDlTheory, Total: totalDlTheory },
    { name: 'ML Practice', Completed: completedMlPrac, Total: totalMlPrac },
    { name: 'DL Practice', Completed: completedDlPrac, Total: totalDlPrac },
    { name: 'Mini Tasks', Completed: completedTasks, Total: totalTasks }
  ];

  // Strongest vs Weakest readout
  const sortedTheory = [...theoryTopics].sort((a, b) => b.confidenceScore - a.confidenceScore);
  const strongestTopic = sortedTheory[0];
  const weakestTopic = sortedTheory[sortedTheory.length - 1];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 text-zinc-100 bg-[#020202] min-h-screen">
        
        {/* ======================================================== */}
        {/* 1. TOP HEADER SECTION                                    */}
        {/* ======================================================== */}
        <div className="glass rounded-2xl p-6 border-white/5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none" />
          
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <BrainCircuit className="text-blue-500 h-9 w-9 animate-pulse" />
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                ML/DL Prep Center
              </h1>
            </div>
            <p className="text-sm text-zinc-400 max-w-md">
              A comprehensive mission workstation built to optimize conceptual mastery, debugging intuition, and system implementation.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 z-10">
            {/* Completion Percentage Ring */}
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="34" 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeWidth="6" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="34" 
                    stroke="#3b82f6" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - metrics.overallCompletionPercent / 100)}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-mono font-bold text-blue-400">{metrics.overallCompletionPercent}%</span>
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-semibold">Done</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Overall Completion</div>
                <div className="text-sm font-bold text-zinc-300">
                  {theoryTopics.filter(t => t.completed).length + practiceTopics.filter(p => p.completed).length}/{theoryTopics.length + practiceTopics.length} Units
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 border-l border-white/10 pl-6 h-full">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">Current Focus</span>
                <span className="text-xs font-bold text-zinc-300 truncate max-w-[120px] block" title={metrics.currentFocusTopicName}>
                  {metrics.currentFocusTopicName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">Weakest Topic</span>
                <span className="text-xs font-bold text-red-400 truncate max-w-[120px] block" title={metrics.weakestTopicName}>
                  {metrics.weakestTopicName} ({metrics.weakestTopicConfidence}%)
                </span>
              </div>
              <div className="col-span-2 mt-1">
                <span className="text-[10px] text-indigo-400 block uppercase tracking-wider flex items-center gap-1 font-semibold">
                  <Award className="h-3 w-3" /> Interview Readiness
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Progress value={metrics.readinessScore} className="h-1.5 w-24 bg-white/5" />
                  <span className="text-xs font-bold font-mono text-indigo-300">{metrics.readinessScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. MAIN NAVIGATION TABS                                  */}
        {/* ======================================================== */}
        <div className="flex items-center overflow-x-auto gap-2 pb-2 border-b border-white/5 custom-scrollbar">
          {[
            { id: 'ml-theory', label: 'ML Theory', count: theoryTopics.filter(t => t.category === 'ML' && t.completed).length + '/' + theoryTopics.filter(t => t.category === 'ML').length },
            { id: 'ml-practice', label: 'ML Practice', count: practiceTopics.slice(0, 6).filter(p => p.completed).length + '/6' },
            { id: 'dl-theory', label: 'DL Theory', count: theoryTopics.filter(t => t.category === 'DL' && t.completed).length + '/' + theoryTopics.filter(t => t.category === 'DL').length },
            { id: 'dl-practice', label: 'DL Practice', count: practiceTopics.slice(6).filter(p => p.completed).length + '/2' },
            { id: 'mini-tasks', label: 'Mini Tasks', count: miniTasks.filter(t => t.completed).length + '/5' },
            { id: 'interview-questions', label: 'Interview Questions', count: interviewQuestions.filter(q => q.answeredConfidently).length + '/' + interviewQuestions.length },
            { id: 'revision-queue', label: 'Revision Queue', count: metrics.revisionQueue.length, badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 border flex items-center gap-2 outline-none",
                activeTab === tab.id
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              )}
            >
              <span>{tab.label}</span>
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-mono border",
                activeTab === tab.id 
                  ? "bg-blue-700 border-blue-600 text-blue-100" 
                  : tab.badgeColor || "bg-white/5 border-white/10 text-zinc-500"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* WORKSTATION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT 2/3 COLUMN: TAB CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ======================================================== */}
            {/* 3 & 4. THEORY SECTIONS (ML & DL)                         */}
            {/* ======================================================== */}
            {(activeTab === 'ml-theory' || activeTab === 'dl-theory') && (
              <div className="space-y-6">
                {/* Filters panel */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-950 p-4 rounded-xl border border-white/5">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search concepts..." 
                      value={theorySearch}
                      onChange={(e) => setTheorySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 text-xs bg-black rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                    <select
                      value={theoryFilter}
                      onChange={(e) => setTheoryFilter(e.target.value as any)}
                      className="bg-black border border-white/10 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed Only</option>
                      <option value="incomplete">Incomplete Only</option>
                      <option value="bookmarked">Bookmarked Only</option>
                    </select>

                    <select
                      value={theorySort}
                      onChange={(e) => setTheorySort(e.target.value as any)}
                      className="bg-black border border-white/10 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="confidence-asc">Confidence: Low to High</option>
                      <option value="confidence-desc">Confidence: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Topics list */}
                <div className="grid gap-3">
                  {getFilteredTheoryTopics(activeTab === 'ml-theory' ? 'ML' : 'DL').map(topic => {
                    const isExpanded = !!expandedTheoryIds[topic.id];
                    // Derive dynamic tags for revision
                    const needsPracticeFlag = topic.needsPractice || topic.confidenceScore < 40;
                    
                    return (
                      <div 
                        key={topic.id}
                        className={cn(
                          "glass rounded-xl border transition-all duration-300 overflow-hidden",
                          topic.completed ? "border-emerald-500/20 bg-emerald-500/[0.01]" : "border-white/5 hover:border-white/10"
                        )}
                      >
                        {/* Header bar */}
                        <div className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              onClick={() => updateTheoryTopic(topic.id, { completed: !topic.completed })}
                              className="focus:outline-none hover:scale-105 transition-transform"
                            >
                              {topic.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                              ) : (
                                <Circle className="h-5 w-5 text-zinc-600" />
                              )}
                            </button>
                            <div className="min-w-0">
                              <h4 className={cn("font-bold text-sm sm:text-base", topic.completed ? "text-zinc-300" : "text-white")}>
                                {topic.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                  "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border",
                                  topic.confidenceScore >= 80 
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                    : topic.confidenceScore >= 40 
                                    ? "bg-orange-500/10 text-orange-400 border-orange-500/20" 
                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                )}>
                                  Confidence: {topic.confidenceScore}%
                                </span>
                                {needsPracticeFlag && (
                                  <Badge className="bg-red-500/20 text-red-400 border border-red-500/20 text-[9px] px-1.5 py-0">
                                    Revision Due
                                  </Badge>
                                )}
                                <span className="text-[10px] text-zinc-500">Revised: {topic.lastRevised}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Bookmark */}
                            <button
                              onClick={() => updateTheoryTopic(topic.id, { bookmarked: !topic.bookmarked })}
                              className="p-1 rounded hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                            >
                              {topic.bookmarked ? (
                                <BookmarkCheck className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </button>

                            {/* Expand toggle */}
                            <button
                              onClick={() => toggleTheoryExpanded(topic.id, topic.notes, topic.confidenceScore)}
                              className="p-1 rounded hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Details */}
                        {isExpanded && (
                          <div className="p-4 pt-0 border-t border-white/5 bg-zinc-950/40 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                              {/* Confidence slide control */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                                  <span>Update Confidence</span>
                                  <span className="text-blue-400">{theoryConf[topic.id] ?? topic.confidenceScore}%</span>
                                </div>
                                <div className="py-2">
                                  <Slider
                                    min={0}
                                    max={100}
                                    step={5}
                                    value={[theoryConf[topic.id] ?? topic.confidenceScore]}
                                    onValueChange={(val) => setTheoryConf(prev => ({ ...prev, [topic.id]: (val as number[])[0] }))}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => markTheoryRevised(topic.id)}
                                    className="flex-1 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold hover:bg-emerald-500/20 transition-colors"
                                  >
                                    Mark Revised (+15% Conf)
                                  </button>
                                  <button
                                    onClick={() => updateTheoryTopic(topic.id, { needsPractice: !topic.needsPractice })}
                                    className={cn(
                                      "flex-1 py-1 rounded border text-[10px] font-bold transition-colors",
                                      topic.needsPractice 
                                        ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30" 
                                        : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10"
                                    )}
                                  >
                                    {topic.needsPractice ? 'Flagged for Practice' : 'Flag for Practice'}
                                  </button>
                                </div>
                              </div>

                              {/* Revision due details */}
                              <div className="space-y-1 text-xs">
                                <span className="text-zinc-500 font-semibold block uppercase tracking-wider">Intuition & Formulas</span>
                                <div className="bg-black/60 p-2.5 rounded-lg text-zinc-400 font-mono text-[10px] leading-relaxed max-h-[85px] overflow-y-auto">
                                  {topic.id === 'ml-linear' && 'theta = (X^T X)^-1 X^T y\nMSE = (1/n) * sum((y - y_pred)^2)'}
                                  {topic.id === 'ml-logistic' && 'P(y=1|x) = sigmoid(w^T x + b)\nLogLoss = -y*log(p) - (1-y)*log(1-p)'}
                                  {topic.id === 'ml-biasvar' && 'Error = Bias^2 + Variance + IrreducibleError'}
                                  {topic.id === 'dl-perceptron' && 'y = step(w^T x + b)\nw = w + lr * (target - output) * x'}
                                  {topic.id === 'dl-transformers' && 'Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V'}
                                  {topic.id === 'dl-activation' && 'ReLU = max(0, x)\nSigmoid = 1 / (1 + e^-x)\nTanh = (e^x - e^-x) / (e^x + e^-x)'}
                                  {!['ml-linear', 'ml-logistic', 'ml-biasvar', 'dl-perceptron', 'dl-transformers', 'dl-activation'].includes(topic.id) && 'Save custom equations and cheat sheets below.'}
                                </div>
                              </div>
                            </div>

                            {/* Notes Textarea */}
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-zinc-400 block">Personal Review Notes</label>
                              <textarea
                                value={theoryNotes[topic.id] ?? ''}
                                onChange={(e) => setTheoryNotes(prev => ({ ...prev, [topic.id]: e.target.value }))}
                                rows={3}
                                className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
                                placeholder="Add key points, equations, or interview notes..."
                              />
                            </div>

                            {/* Save modifications bar */}
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  // Commit sliders and text fields
                                  const updatedNotes = theoryNotes[topic.id] ?? topic.notes;
                                  const updatedConf = theoryConf[topic.id] ?? topic.confidenceScore;
                                  updateTheoryTopic(topic.id, { 
                                    notes: updatedNotes, 
                                    confidenceScore: updatedConf
                                  });
                                }}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                              >
                                <Save className="h-3.5 w-3.5" /> Save Changes
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {getFilteredTheoryTopics(activeTab === 'ml-theory' ? 'ML' : 'DL').length === 0 && (
                    <div className="text-center p-8 text-zinc-500 text-xs">No concepts found matching your filters.</div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 5. IMPLEMENTATION PRACTICE SECTIONS (ML & DL)            */}
            {/* ======================================================== */}
            {(activeTab === 'ml-practice' || activeTab === 'dl-practice') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-xl border border-white/5">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search practice blocks..." 
                      value={practiceSearch}
                      onChange={(e) => setPracticeSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 text-xs bg-black rounded-lg border border-white/10 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  {getFilteredPractice(activeTab === 'ml-practice' ? 'ML' : 'DL').map(practice => {
                    return (
                      <div key={practice.id} className="glass rounded-xl border border-white/5 p-5 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updatePracticeTopic(practice.id, { completed: !practice.completed })}
                              className="focus:outline-none"
                            >
                              {practice.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                              ) : (
                                <Circle className="h-5 w-5 text-zinc-600" />
                              )}
                            </button>
                            <div>
                              <h3 className="font-bold text-base text-white">{practice.name}</h3>
                              <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
                                <span className="flex items-center gap-1 font-mono text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">
                                  Practiced: {practice.practiceCount} times
                                </span>
                                <span>Last: {practice.lastPracticed}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Confidence</span>
                            <span className="text-sm font-bold text-zinc-200">{practice.confidence}%</span>
                          </div>
                        </div>

                        {/* Interactive sliders and logs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-zinc-400 block">Bugs Faced & Solutions</label>
                              <textarea
                                value={practiceBugs[practice.id] ?? practice.bugsFaced}
                                onChange={(e) => setPracticeBugs(prev => ({ ...prev, [practice.id]: e.target.value }))}
                                rows={2}
                                className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none"
                                placeholder="List errors, shape mismatches, runtime issues..."
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs font-semibold text-zinc-400">
                                  <span>Confidence Rating</span>
                                  <span className="text-blue-400">{practiceConf[practice.id] ?? practice.confidence}%</span>
                              </div>
                              <Slider
                                min={0}
                                max={100}
                                step={5}
                                value={[practiceConf[practice.id] ?? practice.confidence]}
                                onValueChange={(val) => setPracticeConf(prev => ({ ...prev, [practice.id]: (val as number[])[0] }))}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-zinc-400 block">Implementation Notes</label>
                              <textarea
                                value={practiceNotes[practice.id] ?? practice.notes}
                                onChange={(e) => setPracticeNotes(prev => ({ ...prev, [practice.id]: e.target.value }))}
                                rows={4}
                                className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none"
                                placeholder="Key setup codes, shape mappings, hyperparams..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => {
                              const conf = practiceConf[practice.id] ?? practice.confidence;
                              const bugs = practiceBugs[practice.id] ?? practice.bugsFaced;
                              const notes = practiceNotes[practice.id] ?? practice.notes;
                              markPracticeDone(practice.id, conf, bugs, notes);
                            }}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Code2 className="h-4 w-4" /> Log Practice & Updates
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 6. MINI TASKS SECTION                                    */}
            {/* ======================================================== */}
            {activeTab === 'mini-tasks' && (
              <div className="space-y-4">
                <div className="bg-zinc-950 p-4 rounded-xl border border-white/5">
                  <h3 className="font-bold text-sm text-zinc-400">Task-based Projects Execution</h3>
                  <p className="text-xs text-zinc-500 mt-1">Implement models on actual datasets. Provide GitHub repos to verify completion.</p>
                </div>

                <div className="grid gap-4">
                  {miniTasks.map(task => {
                    return (
                      <div key={task.id} className="glass rounded-xl border border-white/5 p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateMiniTask(task.id, { completed: !task.completed })}
                              className="focus:outline-none"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                              ) : (
                                <Circle className="h-5 w-5 text-zinc-600" />
                              )}
                            </button>
                            <div>
                              <h3 className="font-bold text-base text-white">{task.title}</h3>
                              <p className="text-xs text-zinc-400 mt-1">{task.objective}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-start">
                            <Badge className={cn(
                              task.difficulty === 'Easy' && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                              task.difficulty === 'Medium' && 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                              task.difficulty === 'Hard' && 'bg-red-500/10 text-red-400 border-red-500/20'
                            )}>
                              {task.difficulty}
                            </Badge>
                            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {task.estimatedDuration}
                            </span>
                          </div>
                        </div>

                        {/* Expand panel for details */}
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                          <div>
                            <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">Dataset Info</span>
                            <span className="text-xs font-semibold text-zinc-300">{task.datasetInfo}</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-zinc-400 block">GitHub Repository Link</label>
                              <input 
                                type="text"
                                placeholder="https://github.com/..."
                                value={taskGithub[task.id] ?? task.githubLink}
                                onChange={(e) => setTaskGithub(prev => ({ ...prev, [task.id]: e.target.value }))}
                                className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-zinc-400 block">Development Learnings</label>
                              <textarea
                                placeholder="What worked? What hyperparameters did you tune? Validation scores..."
                                value={taskNotes[task.id] ?? task.notes}
                                onChange={(e) => setTaskNotes(prev => ({ ...prev, [task.id]: e.target.value }))}
                                rows={2}
                                className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              const repo = taskGithub[task.id] ?? task.githubLink;
                              const notes = taskNotes[task.id] ?? task.notes;
                              updateMiniTask(task.id, { githubLink: repo, notes });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Save className="h-3.5 w-3.5" /> Save Task Progress
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 7. INTERVIEW QUESTIONS SECTION                           */}
            {/* ======================================================== */}
            {activeTab === 'interview-questions' && (
              <div className="space-y-6">
                
                {/* Category Pills Selector */}
                <div className="flex flex-wrap gap-2 pb-2 border-b border-white/5">
                  {(['ML Fundamentals', 'DL Fundamentals', 'Practical ML', 'Project Discussion', 'Debugging Questions'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedQuestionCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                        selectedQuestionCategory === cat
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-950 text-zinc-400 border border-white/5 hover:text-zinc-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search interview questions..." 
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-950 rounded-lg border border-white/10 focus:outline-none"
                  />
                </div>

                <div className="space-y-4">
                  {getFilteredQuestions().map(q => {
                    return (
                      <div key={q.id} className="glass rounded-xl border border-white/5 p-5 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-start gap-3">
                            <HelpCircle className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-sm sm:text-base text-zinc-200">{q.question}</h4>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => updateInterviewQuestion(q.id, { bookmarked: !q.bookmarked })}
                            className="p-1 rounded hover:bg-white/5 text-zinc-400 hover:text-white shrink-0"
                          >
                            <Bookmark className={cn("h-4 w-4", q.bookmarked && "fill-yellow-500 text-yellow-500")} />
                          </button>
                        </div>

                        {/* Interactive fields: rating, confidently, notes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5">
                          <div className="space-y-4">
                            {/* Confidence Star Rating */}
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-zinc-400 block">Self Rating (Confidence)</span>
                              <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map(rating => (
                                  <button
                                    key={rating}
                                    onClick={() => updateInterviewQuestion(q.id, { selfRating: rating })}
                                    className="p-0.5 hover:scale-110 transition-transform"
                                  >
                                    <Star className={cn(
                                      "h-5 w-5",
                                      rating <= q.selfRating ? "fill-yellow-500 text-yellow-500" : "text-zinc-600"
                                    )} />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="flex flex-col gap-2 pt-2">
                              <label className="flex items-center gap-2 text-xs font-medium text-zinc-300 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={q.answeredConfidently}
                                  onChange={(e) => updateInterviewQuestion(q.id, { answeredConfidently: e.target.checked })}
                                  className="rounded bg-black border-white/10 text-purple-600 focus:ring-0"
                                />
                                Answered Confidently (Ready for mock)
                              </label>

                              <label className="flex items-center gap-2 text-xs font-medium text-red-400 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={q.revisionNeeded}
                                  onChange={(e) => updateInterviewQuestion(q.id, { revisionNeeded: e.target.checked })}
                                  className="rounded bg-black border-white/10 text-red-600 focus:ring-0"
                                />
                                Flag for Revision Queue
                              </label>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 block">Personal Draft Explanation</label>
                            <textarea
                              value={questionNotes[q.id] ?? q.notes}
                              onChange={(e) => setQuestionNotes(prev => ({ ...prev, [q.id]: e.target.value }))}
                              rows={3}
                              className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-xs text-zinc-300 focus:outline-none"
                              placeholder="Type your answer, STAR outline, or key bullet points..."
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              const notes = questionNotes[q.id] ?? q.notes;
                              updateInterviewQuestion(q.id, { notes });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Save className="h-3.5 w-3.5" /> Save Question Log
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {getFilteredQuestions().length === 0 && (
                    <div className="text-center p-8 text-zinc-500 text-xs">No questions found matching search query.</div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 8. REVISION QUEUE SECTION                                */}
            {/* ======================================================== */}
            {activeTab === 'revision-queue' && (
              <div className="space-y-6">
                <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm text-red-300">Spaced Revision Engine Active</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Topics slide in here automatically if confidence drops below 40%, if they are flagged for practice, or if 7 days pass since their last review.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {metrics.revisionQueue.length === 0 ? (
                    <div className="glass rounded-xl p-8 border-dashed border-white/10 text-center space-y-2">
                      <Check className="h-10 w-10 text-emerald-400 mx-auto" />
                      <h4 className="font-bold text-white text-base">Revision Queue Clear!</h4>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto">Maintain high confidence and review regularly to keep this queue empty.</p>
                    </div>
                  ) : (
                    metrics.revisionQueue.map((item, index) => (
                      <div key={index} className="glass p-4 rounded-xl border border-red-500/10 bg-red-500/[0.01] flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase",
                              item.type === 'Theory' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' : 'bg-purple-500/10 text-purple-400 border border-purple-500/10'
                            )}>
                              {item.type}
                            </span>
                            <h4 className="text-sm font-bold text-zinc-200">{item.name}</h4>
                          </div>
                          <p className="text-xs text-red-400/80 font-medium">Reason: {item.reason}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-zinc-500">Conf: {item.confidence}%</span>
                          {item.type === 'Theory' ? (
                            <button
                              onClick={() => markTheoryRevised(item.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase transition-colors"
                            >
                              Mark Revised
                            </button>
                          ) : (
                            <button
                              onClick={() => updateInterviewQuestion(item.id, { answeredConfidently: true, revisionNeeded: false, selfRating: 4 })}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase transition-colors"
                            >
                              Ready
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT 1/3 COLUMN: DAILY GOALS & ANALYTICS PANELS */}
          <div className="space-y-6">
            
            {/* ======================================================== */}
            {/* 10. DAILY GOALS PANEL                                     */}
            {/* ======================================================== */}
            <div className="glass rounded-2xl p-5 border-white/5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Flame className="text-orange-500 h-4.5 w-4.5" /> Daily goals
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {dailyGoals.filter(g => g.completed).length}/{dailyGoals.length} Done
                </span>
              </div>

              {/* Checklist list */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {dailyGoals.map(goal => {
                  const isGoalExpanded = !!expandedGoalIds[goal.id];
                  return (
                    <div key={goal.id} className="p-2.5 rounded-lg bg-zinc-950 border border-white/5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <input 
                            type="checkbox"
                            checked={goal.completed}
                            onChange={(e) => updateDailyGoal(goal.id, { completed: e.target.checked })}
                            className="rounded bg-black border-white/10 text-orange-500 focus:ring-0 mt-0.5"
                          />
                          <span className={cn(
                            "text-xs font-medium block truncate max-w-[150px]",
                            goal.completed ? "text-zinc-500 line-through" : "text-zinc-200"
                          )} title={goal.title}>
                            {goal.title}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setExpandedGoalIds(prev => ({ ...prev, [goal.id]: !prev[goal.id] }))}
                            className="p-0.5 hover:bg-white/5 rounded text-zinc-500"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => deleteDailyGoal(goal.id)}
                            className="p-0.5 hover:bg-white/5 rounded text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Goal expansion for time logging and notes */}
                      {isGoalExpanded && (
                        <div className="pt-2 border-t border-white/5 space-y-2">
                          <div className="flex items-center justify-between gap-2 text-[10px]">
                            <span className="text-zinc-400">Time Spent (mins):</span>
                            <input 
                              type="number"
                              placeholder="0"
                              value={goalTimes[goal.id] ?? goal.timeSpent}
                              onChange={(e) => setGoalTimes(prev => ({ ...prev, [goal.id]: parseInt(e.target.value) || 0 }))}
                              className="w-16 bg-black border border-white/10 rounded px-1.5 py-0.5 font-mono text-center focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-400">Notes / Outcomes:</span>
                            <textarea
                              placeholder="Add notes for this goal..."
                              value={goalNotes[goal.id] ?? goal.notes}
                              onChange={(e) => setGoalNotes(prev => ({ ...prev, [goal.id]: e.target.value }))}
                              rows={2}
                              className="w-full bg-black border border-white/10 rounded p-1.5 text-[10px] text-zinc-300 focus:outline-none"
                            />
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                const time = goalTimes[goal.id] ?? goal.timeSpent;
                                const notes = goalNotes[goal.id] ?? goal.notes;
                                updateDailyGoal(goal.id, { timeSpent: time, notes, completed: true });
                                setExpandedGoalIds(prev => ({ ...prev, [goal.id]: false }));
                              }}
                              className="px-2 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-[9px] flex items-center gap-1"
                            >
                              Save & Complete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add goal */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="New goal..." 
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-orange-500"
                />
                <button
                  onClick={() => {
                    if (newGoalTitle.trim()) {
                      addDailyGoal(newGoalTitle);
                      setNewGoalTitle('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 9. ANALYTICS PANEL                                        */}
            {/* ======================================================== */}
            <div className="glass rounded-2xl p-5 border-white/5 space-y-6">
              <div className="pb-2 border-b border-white/5">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <TrendingUp className="text-blue-500 h-4.5 w-4.5" /> Analytics
                </h3>
              </div>

              {/* Radar chart */}
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Key topics confidence</span>
                <div className="h-[200px] flex items-center justify-center bg-black/30 rounded-xl p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.05)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Confidence" dataKey="Confidence" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Completion Bar Chart */}
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Progress Breakdown</span>
                <div className="h-[180px] bg-black/30 rounded-xl p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={9} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff', fontSize: 10 }}
                        labelStyle={{ fontSize: 10, fontWeight: 'bold' }}
                      />
                      <Bar dataKey="Completed" fill="#10b981" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="Total" fill="rgba(255,255,255,0.05)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Text readout */}
              <div className="space-y-3 pt-2 border-t border-white/5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Strongest Area</span>
                  <span className="font-bold text-emerald-400">{strongestTopic ? strongestTopic.name : 'N/A'} ({strongestTopic ? strongestTopic.confidenceScore : 0}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Weakest Area</span>
                  <span className="font-bold text-red-400">{weakestTopic ? weakestTopic.name : 'N/A'} ({weakestTopic ? weakestTopic.confidenceScore : 0}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Revision Workload</span>
                  <span className="font-bold text-zinc-300">{metrics.revisionQueue.length} items queued</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </PageTransition>
  );
}
