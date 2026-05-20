'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { LineChart as ChartIcon, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

const readinessData = [
  { day: 'Day 1', score: 0 },
  { day: 'Day 5', score: 12 },
  { day: 'Day 10', score: 25 },
  { day: 'Day 15', score: 35 },
  { day: 'Day 20', score: 48 },
  { day: 'Day 25', score: 60 },
  { day: 'Day 30', score: 75 },
];

const hourDistribution = [
  { name: 'DSA', hours: 45, fill: '#f97316' },
  { name: 'ML/DL', hours: 30, fill: '#3b82f6' },
  { name: 'Projects', hours: 25, fill: '#a855f7' },
  { name: 'GATE', hours: 20, fill: '#10b981' },
  { name: 'Mock/OA', hours: 10, fill: '#ef4444' },
];

export default function AnalyticsPage() {
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
              <div className="text-3xl font-bold">130 <span className="text-lg font-normal text-zinc-500">hrs</span></div>
            </CardContent>
          </Card>
          <Card className="glass border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-200">Strongest Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-emerald-400">DSA (Trees)</div>
              <p className="text-xs text-emerald-500/70 mt-1">90% Accuracy</p>
            </CardContent>
          </Card>
          <Card className="glass border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-200">Weakest Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-400">ML (XGBoost)</div>
              <p className="text-xs text-red-500/70 mt-1">Needs Revision</p>
            </CardContent>
          </Card>
          <Card className="glass border-orange-500/20 bg-orange-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <AlertTriangle className="h-4 w-4 text-orange-500 opacity-50" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-200">Burnout Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-orange-500">Moderate</div>
              <p className="text-xs text-orange-500/70 mt-1">Averaging 7hrs/day</p>
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
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={readinessData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
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
