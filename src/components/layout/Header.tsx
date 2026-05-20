'use client';

import { useStore } from '@/store/useStore';
import { Flame, Target, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export function Header() {
  const { stats } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <header className="h-16 border-b border-white/5 glass flex items-center justify-between px-6" />;

  return (
    <header className="h-16 border-b border-white/5 glass flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-zinc-400 hidden sm:block">Mission Status</h2>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-zinc-400" />
          <span className="text-sm font-bold">Day {stats.currentDay}/50</span>
        </div>
        
        <div className="h-4 w-px bg-white/10 hidden sm:block" />
        
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-bold">{stats.streak} Streak</span>
        </div>
        
        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-indigo-400" />
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
            Readiness: {stats.readinessScore}%
          </Badge>
        </div>
      </div>
    </header>
  );
}
