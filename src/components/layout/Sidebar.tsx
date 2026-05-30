'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, Code2, BrainCircuit, Rocket, Mic, Activity, LineChart, BookText, CalendarDays, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: '50-Day Roadmap', href: '/roadmap', icon: Map },
  { name: 'DSA Tracker', href: '/dsa', icon: Code2 },
  { name: 'ML/DL Prep', href: '/ml-dl', icon: BrainCircuit },
  { name: 'Projects', href: '/projects', icon: Rocket },
  { name: 'Interview Center', href: '/interview', icon: Mic },
  { name: 'OA Simulation', href: '/oa', icon: Activity },
  { name: 'Daily Reflection', href: '/reflection', icon: BookText },
  { name: 'Daily Planner', href: '/schedule', icon: CalendarDays },
  { name: 'Targets & Backlog', href: '/backlog', icon: Target },
  { name: 'Analytics', href: '/analytics', icon: LineChart },
];

export { navItems };

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-white/5 bg-background/50 glass p-4 hidden md:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2 group">
        <div className="h-8 w-8 rounded bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-300">
          <span className="font-bold text-white tracking-tighter text-xs">X50</span>
        </div>
        <span className="text-xl font-bold tracking-tight group-hover:text-indigo-300 transition-colors">InternX50</span>
      </Link>
      
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative group",
                isActive 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-full" />
              )}
              <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-indigo-400" : "group-hover:text-indigo-400/60")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-2 pb-4">
        <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-4">
          <p className="text-xs font-semibold text-indigo-300 mb-1">50 Days Mission</p>
          <p className="text-[10px] text-zinc-400">Consistency is the only metric that matters.</p>
        </div>
      </div>
    </div>
  );
}
