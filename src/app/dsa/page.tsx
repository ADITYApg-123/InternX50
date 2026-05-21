'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Code2, Target, Trophy, Flame } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';

export default function DSAPage() {
  const { topicMastery } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dsaTopics = Object.values(topicMastery).filter(t => t.category === 'DSA');

  const totalSolved = dsaTopics.reduce((acc, curr) => acc + curr.solvedCount, 0);
  const totalQuestions = dsaTopics.reduce((acc, curr) => acc + curr.totalQuestions, 0);

  const radarData = dsaTopics.map(t => ({
    subject: t.name,
    A: t.confidenceScore,
    fullMark: 100,
  }));

  const currentFocus = dsaTopics.reduce((prev, current) => (prev.confidenceScore > current.confidenceScore) ? current : prev, dsaTopics[0]);
  const weakestTopic = dsaTopics.reduce((prev, current) => (prev.confidenceScore < current.confidenceScore) ? current : prev, dsaTopics[0]);
  
  const avgConfidence = dsaTopics.length > 0 ? dsaTopics.reduce((acc, t) => acc + t.confidenceScore, 0) / dsaTopics.length : 0;

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Code2 className="text-orange-500 h-8 w-8" /> DSA Tracker
          </h1>
          <p className="text-zinc-400 mt-1">Master patterns, not just problems.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass border-orange-500/20 bg-orange-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-200">Total Solved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-500">{totalSolved} <span className="text-lg text-orange-500/50">/ {totalQuestions}</span></div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Current Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-400" /> {currentFocus?.name || 'None'}
              </div>
              <p className="text-sm text-zinc-500 mt-1">{currentFocus?.confidenceScore || 0}% Confidence</p>
            </CardContent>
          </Card>

          <Card className="glass border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Weakest Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Flame className="h-5 w-5 text-red-400" /> {weakestTopic?.name || 'None'}
              </div>
              <p className="text-sm text-zinc-500 mt-1">Needs revision</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" /> Topic Mastery
            </h2>
            <div className="grid gap-3">
              {dsaTopics.map(topic => {
                const progress = Math.min(100, Math.round((topic.solvedCount / topic.totalQuestions) * 100));
                return (
                  <div key={topic.topicId} className="glass p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{topic.name}</span>
                      <Badge variant="outline" className="border-white/10 bg-white/5">
                        {topic.solvedCount}/{topic.totalQuestions} Solved
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2 bg-white/10" />
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Confidence: {topic.confidenceScore}%</span>
                      <span>Progress: {progress}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Confidence Radar</h2>
            <Card className="glass border-white/5 p-4 h-[400px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Confidence" dataKey="A" stroke="#f97316" fill="#f97316" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <div className="glass p-6 rounded-xl border border-white/5 mt-6">
              <h3 className="font-bold mb-2">OA Readiness</h3>
              <p className="text-sm text-zinc-400 mb-4">Based on your pattern completion, you are currently ready to clear online assessments for tier-2 companies.</p>
              <Progress value={avgConfidence} className="h-2 bg-white/10" />
              <div className="flex justify-between text-xs mt-2 font-medium">
                <span className="text-zinc-500">Tier-3 Ready</span>
                <span className="text-orange-400">Overall: {Math.round(avgConfidence)}%</span>
                <span className="text-zinc-600">Tier-1 Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
