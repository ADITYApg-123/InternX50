'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { BrainCircuit, BookOpen, PenTool, GitBranch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';

export default function MLDLPage() {
  const { topicMastery, roadmap } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const mldlTopics = Object.values(topicMastery).filter(t => t.category === 'ML/DL');
  
  const mlTopics = mldlTopics.filter(t => t.topicId.startsWith('ml-'));
  const dlTopics = mldlTopics.filter(t => t.topicId.startsWith('dl-'));

  const totalQuestions = mldlTopics.reduce((acc, t) => acc + t.totalQuestions, 0);
  const totalSolved = mldlTopics.reduce((acc, t) => acc + t.solvedCount, 0);
  const overallCompletion = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

  let miniTasksTotal = 0;
  let miniTasksCompleted = 0;
  
  roadmap.forEach(day => {
    day.tasks.filter(t => t.category === 'ML/DL').forEach(t => {
      miniTasksTotal++;
      if (t.status === 'Completed') miniTasksCompleted++;
    });
  });

  const getStatusBadge = (confidence: number) => {
    if (confidence >= 80) return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Mastered</Badge>;
    if (confidence >= 40) return <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">In Progress</Badge>;
    return <Badge variant="outline" className="bg-white/5 text-zinc-500 border-white/10">Needs Work</Badge>;
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="text-blue-500 h-8 w-8" /> ML/DL Preparation
          </h1>
          <p className="text-zinc-400 mt-1">Theory, mathematical intuition, and implementation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass border-blue-500/20 bg-blue-500/5 col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-200 flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Overall ML/DL Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="text-4xl font-bold text-blue-500">{overallCompletion}%</div>
                <Progress value={overallCompletion} className="h-2 bg-blue-950" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <PenTool className="h-4 w-4" /> Mini Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{miniTasksCompleted} <span className="text-sm text-zinc-500 font-normal">/ {miniTasksTotal}</span></div>
              <p className="text-xs text-zinc-500 mt-1">Scripts implemented</p>
            </CardContent>
          </Card>

          <Card className="glass border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <GitBranch className="h-4 w-4" /> Solved Concepts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{totalSolved} <span className="text-sm text-zinc-500 font-normal">/ {totalQuestions}</span></div>
              <p className="text-xs text-zinc-500 mt-1">Practice items</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ml" className="w-full">
          <TabsList className="glass bg-white/5 border border-white/10">
            <TabsTrigger value="ml">Machine Learning</TabsTrigger>
            <TabsTrigger value="dl">Deep Learning</TabsTrigger>
            <TabsTrigger value="mini">Mini Implementations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ml" className="mt-6 space-y-4">
            <div className="grid gap-4">
              {mlTopics.map(topic => (
                <div key={topic.topicId} className="glass p-5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{topic.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      {getStatusBadge(topic.confidenceScore)}
                      <span className="text-xs text-zinc-400">Confidence: {topic.confidenceScore}%</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
                    Review Notes
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dl" className="mt-6 space-y-4">
            <div className="grid gap-4">
              {dlTopics.map(topic => (
                <div key={topic.topicId} className="glass p-5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{topic.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      {getStatusBadge(topic.confidenceScore)}
                      <span className="text-xs text-zinc-400">Confidence: {topic.confidenceScore}%</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
                    Review Notes
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mini" className="mt-6">
            <div className="glass p-8 rounded-xl border border-white/5 text-center space-y-4">
              <PenTool className="h-12 w-12 text-zinc-500 mx-auto opacity-50" />
              <h3 className="text-xl font-bold">Implement from Scratch</h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                Implement Linear Regression, KMeans, and a basic MLP using only NumPy to solidify your understanding.
              </p>
              <button className="mt-4 px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                View Task List
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
