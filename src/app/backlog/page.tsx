'use client';

import { useState } from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Target, Plus, Trash2, Edit2, Play, Check, CircleDot, Briefcase, Rocket, Focus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { BacklogItemType, BacklogItemStatus } from '@/lib/types';

export default function BacklogPage() {
  const { backlogItems, addBacklogItem, updateBacklogItem, deleteBacklogItem } = useStore();
  
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState<BacklogItemType>('Work');
  
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    
    addBacklogItem({
      title: newItemTitle.trim(),
      type: newItemType,
      status: 'Todo',
    });
    setNewItemTitle('');
  };

  const getStatusIcon = (status: BacklogItemStatus) => {
    switch (status) {
      case 'Todo': return <CircleDot className="w-4 h-4" />;
      case 'In Progress': return <Play className="w-4 h-4" />;
      case 'Done': return <Check className="w-4 h-4" />;
    }
  };
  
  const getTypeIcon = (type: BacklogItemType) => {
    switch (type) {
      case 'Work': return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'Target': return <Focus className="w-4 h-4 text-orange-400" />;
      case 'Project': return <Rocket className="w-4 h-4 text-purple-400" />;
    }
  };

  const cycleStatus = (status: BacklogItemStatus): BacklogItemStatus => {
    if (status === 'Todo') return 'In Progress';
    if (status === 'In Progress') return 'Done';
    return 'Todo';
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-4xl mx-auto pb-20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Target className="text-orange-500 w-8 h-8" /> Targets & Backlog
          </h1>
          <p className="text-zinc-400">Store and manage your upcoming work, long-term targets, and projects.</p>
        </div>

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="What do you want to achieve?"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value as BacklogItemType)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option className="bg-zinc-900 text-white" value="Work">Work</option>
              <option className="bg-zinc-900 text-white" value="Target">Target</option>
              <option className="bg-zinc-900 text-white" value="Project">Project</option>
            </select>
          </div>
          <button 
            type="submit"
            disabled={!newItemTitle.trim()}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </form>

        {/* Backlog List */}
        <div className="grid gap-4 mt-8">
          {backlogItems.length === 0 ? (
            <div className="text-center py-16 glass rounded-2xl border-dashed border-white/10">
              <Target className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-500">Your backlog is empty. Add a target or project above!</p>
            </div>
          ) : (
            backlogItems.sort((a, b) => b.createdAt - a.createdAt).map((item) => (
              <div 
                key={item.id}
                className={cn(
                  "group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl transition-all border",
                  item.status === 'Done'
                    ? "bg-white/5 border-white/5 opacity-60" 
                    : "glass border-white/10 hover:border-orange-500/30"
                )}
              >
                {/* Status Toggle */}
                <button 
                  onClick={() => updateBacklogItem(item.id, { status: cycleStatus(item.status) })}
                  className={cn(
                    "flex-shrink-0 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                    item.status === 'Todo' ? "bg-white/5 border-white/10 text-zinc-400 hover:text-white" :
                    item.status === 'In Progress' ? "bg-orange-500/10 border-orange-500/30 text-orange-400" :
                    "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                  )}
                >
                  {getStatusIcon(item.status)}
                  <span className="hidden sm:inline">{item.status}</span>
                </button>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium flex items-center gap-1.5 w-fit">
                      {getTypeIcon(item.type)} {item.type}
                    </span>
                  </div>
                  <span className={cn(
                    "text-lg transition-all",
                    item.status === 'Done' && "line-through text-zinc-500"
                  )}>
                    {item.title}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button 
                    onClick={() => deleteBacklogItem(item.id)}
                    className="p-2 opacity-0 group-hover:opacity-100 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
}
