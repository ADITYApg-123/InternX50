'use client';

import { useState, useMemo } from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTaskText, setNewTaskText] = useState('');
  
  const { customTasks, addCustomTask, toggleCustomTask, deleteCustomTask, roadmap, stats, completeTask } = useStore();

  const dateString = useMemo(() => {
    return selectedDate.toISOString().split('T')[0];
  }, [selectedDate]);

  const tasksForDate = customTasks[dateString] || [];

  const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
  const missionDayNumber = useMemo(() => {
    if (!stats.missionStartDate) return null;
    const startDate = normalizeDate(new Date(stats.missionStartDate));
    const selDate = normalizeDate(selectedDate);
    const diffTime = selDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 0 && diffDays < 50) return diffDays + 1;
    return null;
  }, [selectedDate, stats.missionStartDate]);

  const roadmapTasks = useMemo(() => {
    if (!missionDayNumber) return [];
    return roadmap.find(d => d.dayNumber === missionDayNumber)?.tasks || [];
  }, [missionDayNumber, roadmap]);

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addCustomTask(dateString, newTaskText.trim());
    setNewTaskText('');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DSA': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'ML/DL': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'GATE': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Projects': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Communication': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
      case 'OA/Mock': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-4xl mx-auto pb-20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Planner</h1>
          <p className="text-zinc-400">Schedule your upcoming tasks and manage your everyday routine.</p>
        </div>

        {/* Date Selector */}
        <div className="glass rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrevDay}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-400" />
            </button>
            
            <div className="flex items-center gap-3 min-w-[200px] justify-center">
              <div className="relative cursor-pointer hover:bg-white/10 p-1.5 rounded-lg transition-colors flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-indigo-400" />
                <input 
                  type="date"
                  value={dateString}
                  onChange={(e) => {
                    if (e.target.value) {
                      const parts = e.target.value.split('-');
                      setSelectedDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  title="Select Date"
                />
              </div>
              <span className="font-semibold text-lg pointer-events-none">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            <button 
              onClick={handleNextDay}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
          
          <button 
            onClick={handleToday}
            className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        {/* Task Input */}
        <form onSubmit={handleAddTask} className="flex gap-3">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <button 
            type="submit"
            disabled={!newTaskText.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-6">
          {tasksForDate.length === 0 && roadmapTasks.length === 0 ? (
            <div className="text-center py-12 glass rounded-2xl border-dashed border-white/10">
              <p className="text-zinc-500">No tasks scheduled for this day.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mission Roadmap Tasks */}
              {roadmapTasks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Day {missionDayNumber} Mission Tasks</h3>
                  {roadmapTasks.map((task) => {
                    const isCompleted = task.status === 'Completed';
                    return (
                      <div 
                        key={task.id}
                        className={cn(
                          "glass p-4 rounded-xl border flex items-start gap-4 transition-all duration-300",
                          isCompleted ? "border-emerald-500/30 bg-emerald-500/5 opacity-60" : "border-white/5 hover:border-white/20"
                        )}
                      >
                        <Checkbox 
                          checked={isCompleted}
                          onCheckedChange={() => completeTask(missionDayNumber!, task.id)}
                          className={cn("mt-1 w-5 h-5 rounded border-white/20", isCompleted && "data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500")}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className={cn("font-medium", isCompleted && "line-through text-zinc-500")}>
                              {task.title}
                            </p>
                            <span className={cn("text-xs px-2 py-0.5 rounded-md border", getCategoryColor(task.category))}>
                              {task.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs font-medium text-zinc-500">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.durationMinutes} mins</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Custom Tasks */}
              {tasksForDate.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2 mt-6">Custom Tasks</h3>
                  {tasksForDate.map((task) => (
                    <div 
                      key={task.id}
                      className={cn(
                        "group flex items-center gap-4 p-4 rounded-xl transition-all border",
                        task.completed 
                          ? "bg-white/5 border-white/5 opacity-60" 
                          : "glass border-white/10 hover:border-indigo-500/30"
                      )}
                    >
                      <button 
                        onClick={() => toggleCustomTask(dateString, task.id)}
                        className="flex-shrink-0 text-zinc-400 hover:text-indigo-400 transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>
                      
                      <span className={cn(
                        "flex-1 text-lg transition-all",
                        task.completed && "line-through text-zinc-500"
                      )}>
                        {task.text}
                      </span>

                      <button 
                        onClick={() => deleteCustomTask(dateString, task.id)}
                        className="p-2 opacity-0 group-hover:opacity-100 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

