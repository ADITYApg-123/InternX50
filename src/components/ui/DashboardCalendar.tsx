'use client';

import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function DashboardCalendar() {
  const { roadmap, stats } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const missionStartDate = stats.missionStartDate ? new Date(stats.missionStartDate) : new Date();
  
  // Strip time for accurate day comparisons
  const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
  const normalizedMissionStart = normalizeDate(missionStartDate);
  const today = normalizeDate(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    // Fill previous month days to align to Sunday
    const firstDay = date.getDay();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }
    
    // Fill current month days
    while (date.getMonth() === month) {
      days.push({ date: new Date(date), isCurrentMonth: true });
      date.setDate(date.getDate() + 1);
    }
    
    // Fill next month days to complete the grid (42 cells max)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  }, [currentMonth]);

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Determine indicator for a specific date
  const getDayIndicator = (cellDate: Date) => {
    const normCellDate = normalizeDate(cellDate);
    const diffTime = normCellDate.getTime() - normalizedMissionStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // If it's outside the 50-day mission
    if (diffDays < 0 || diffDays >= 50) return null;
    
    const missionDayNumber = diffDays + 1;
    const dayPlan = roadmap.find(d => d.dayNumber === missionDayNumber);
    
    if (!dayPlan || dayPlan.tasks.length === 0) return null;

    const completedTasks = dayPlan.tasks.filter(t => t.status === 'Completed').length;
    const isPast = normCellDate.getTime() < today.getTime();

    if (completedTasks === dayPlan.tasks.length) return 'complete';
    if (completedTasks > 0) return 'partial';
    if (isPast) return 'missed';
    return 'pending';
  };

  return (
    <Card className="glass border-white/5 bg-black/40">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Mission Calendar</CardTitle>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded">
            <ChevronLeft className="w-4 h-4 text-zinc-400" />
          </button>
          <span className="text-sm font-medium w-24 text-center">
            {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded">
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((cell, i) => {
            const normCellDate = normalizeDate(cell.date);
            const isToday = normCellDate.getTime() === today.getTime();
            const indicator = getDayIndicator(cell.date);
            
            const diffTime = normCellDate.getTime() - normalizedMissionStart.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const missionDayNumber = diffDays + 1;
            const isMissionDay = diffDays >= 0 && diffDays < 50;
            const isCurrentDay = stats.currentDay === missionDayNumber;
            
            return (
              <button 
                key={i} 
                disabled={!isMissionDay}
                onClick={() => {
                  if (isMissionDay) {
                    useStore.getState().setCurrentDay(missionDayNumber);
                  }
                }}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center rounded-lg relative text-sm",
                  !cell.isCurrentMonth && "opacity-30",
                  isToday && "bg-white/10 font-bold",
                  isCurrentDay && "ring-2 ring-indigo-500 bg-indigo-500/10",
                  isMissionDay ? "hover:bg-white/10 cursor-pointer transition-all" : "cursor-default"
                )}
              >
                <span>{cell.date.getDate()}</span>
                {indicator && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full absolute bottom-1.5",
                    indicator === 'complete' ? "bg-emerald-500" :
                    indicator === 'partial' ? "bg-orange-500" :
                    indicator === 'missed' ? "bg-red-500" :
                    "bg-zinc-600"
                  )} />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Done</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500" /> Partial</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> Missed</div>
        </div>
      </CardContent>
    </Card>
  );
}
