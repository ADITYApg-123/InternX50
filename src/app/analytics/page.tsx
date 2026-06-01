'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { LineChart as ChartIcon, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const { analytics, topicMastery, roadmap, stats } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Compute total hours
  const totalHours = Object.values(analytics.studyHoursByDay).reduce((acc, curr) => acc + curr, 0);

  // Compute readiness trend
  const readinessData = Object.entries(analytics.readinessHistory).map(([day, score]) => ({
    day: `Day ${day}`,
    score,
  }));

  // Compute category distribution
  const categoryHours: Record<string, number> = { DSA: 0, 'ML/DL': 0, Projects: 0, GATE: 0, 'OA/Mock': 0 };
  roadmap.forEach(day => {
    if (day.dayNumber <= stats.currentDay) {
      day.tasks.forEach(task => {
        if (task.status === 'Completed' && categoryHours[task.category] !== undefined) {
          categoryHours[task.category] += task.durationMinutes / 60;
        }
      });
    }
  });

  const hourDistribution = [
    { name: 'DSA', hours: parseFloat(categoryHours['DSA'].toFixed(1)), fill: '#f97316' },
    { name: 'ML/DL', hours: parseFloat(categoryHours['ML/DL'].toFixed(1)), fill: '#3b82f6' },
    { name: 'Projects', hours: parseFloat(categoryHours['Projects'].toFixed(1)), fill: '#a855f7' },
    { name: 'GATE', hours: parseFloat(categoryHours['GATE'].toFixed(1)), fill: '#10b981' },
    { name: 'Mock/OA', hours: parseFloat(categoryHours['OA/Mock'].toFixed(1)), fill: '#ef4444' },
  ];

  // Strongest / Weakest
  const topics = Object.values(topicMastery);
  let strongestTopic = topics[0];
  let weakestTopic = topics[0];

  topics.forEach(t => {
    if (t.confidenceScore > strongestTopic?.confidenceScore) strongestTopic = t;
    if (t.confidenceScore < weakestTopic?.confidenceScore) weakestTopic = t;
  });

  const avgHoursPerDay = stats.currentDay > 0 ? (totalHours / stats.currentDay) : 0;
  const burnoutRisk = avgHoursPerDay > 8 ? 'High' : avgHoursPerDay > 5 ? 'Moderate' : 'Low';
  const burnoutColor = burnoutRisk === 'High' ? 'text-red-500' : burnoutRisk === 'Moderate' ? 'text-orange-500' : 'text-emerald-500';

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ChartIcon className="text-indigo-500 h-8 w-8" /> Analytics
          </h1>
          <p className="text-zinc-400 mt-1">Data-driven insights on your preparation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass border-white/5 bg-black/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Total Study Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalHours.toFixed(1)} <span className="text-lg font-normal text-zinc-500">hrs</span></div>
            </CardContent>
          </Card>
          <Card className="glass border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-200">Strongest Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-emerald-400">{strongestTopic?.name || 'N/A'}</div>
              <p className="text-xs text-emerald-500/70 mt-1">{strongestTopic?.confidenceScore || 0}% Confidence</p>
            </CardContent>
          </Card>
          <Card className="glass border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-200">Weakest Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-400">{weakestTopic?.name || 'N/A'}</div>
              <p className="text-xs text-red-500/70 mt-1">Needs Revision</p>
            </CardContent>
          </Card>
          <Card className="glass border-white/5 bg-black/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <AlertTriangle className={`h-4 w-4 opacity-50 ${burnoutColor}`} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Burnout Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${burnoutColor}`}>{burnoutRisk}</div>
              <p className="text-xs text-zinc-500 mt-1">Averaging {avgHoursPerDay.toFixed(1)} hrs/day</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-400" /> Readiness Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {readinessData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={readinessData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500">No readiness data yet. Start completing tasks!</div>
              )}
            </CardContent>
          </Card>

          <Card className="glass border-white/5">
            <CardHeader>
              <CardTitle>Study Hour Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourDistribution} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={12} width={80} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
