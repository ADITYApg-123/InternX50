'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { BrainCircuit, BookOpen, PenTool, GitBranch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

const mlTopics = [
  { name: 'Linear / Logistic Regression', status: 'Completed', conf: 90 },
  { name: 'Decision Trees & Random Forest', status: 'In Progress', conf: 60 },
  { name: 'XGBoost & Gradient Boosting', status: 'Not Started', conf: 0 },
  { name: 'SVM & Kernels', status: 'Not Started', conf: 0 },
  { name: 'Evaluation Metrics (ROC, AUC, F1)', status: 'Completed', conf: 85 },
];

const dlTopics = [
  { name: 'Neural Network Basics (Backprop)', status: 'Completed', conf: 80 },
  { name: 'Optimizers (Adam, SGD)', status: 'In Progress', conf: 50 },
  { name: 'CNN Architectures (ResNet, VGG)', status: 'Not Started', conf: 0 },
  { name: 'RNNs & LSTMs', status: 'Not Started', conf: 0 },
  { name: 'Transformers & Attention', status: 'Not Started', conf: 0 },
];

export default function MLDLPage() {
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
                <div className="text-4xl font-bold text-blue-500">24%</div>
                <Progress value={24} className="h-2 bg-blue-950" />
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
              <div className="text-2xl font-bold text-white">4 <span className="text-sm text-zinc-500 font-normal">/ 15</span></div>
              <p className="text-xs text-zinc-500 mt-1">Scripts implemented</p>
            </CardContent>
          </Card>

          <Card className="glass border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <GitBranch className="h-4 w-4" /> Interview Qs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">12 <span className="text-sm text-zinc-500 font-normal">/ 50</span></div>
              <p className="text-xs text-zinc-500 mt-1">Mastered concepts</p>
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
                <div key={topic.name} className="glass p-5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{topic.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className={
                        topic.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        topic.status === 'In Progress' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-white/5 text-zinc-500 border-white/10'
                      }>
                        {topic.status}
                      </Badge>
                      <span className="text-xs text-zinc-400">Confidence: {topic.conf}%</span>
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
                <div key={topic.name} className="glass p-5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{topic.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className={
                        topic.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        topic.status === 'In Progress' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-white/5 text-zinc-500 border-white/10'
                      }>
                        {topic.status}
                      </Badge>
                      <span className="text-xs text-zinc-400">Confidence: {topic.conf}%</span>
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
