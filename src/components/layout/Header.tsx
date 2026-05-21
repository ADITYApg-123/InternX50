'use client';

import { useStore } from '@/store/useStore';
import { Flame, Target, CalendarDays, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './Sidebar';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { stats } = useStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (!mounted) return <header className="h-16 border-b border-white/5 glass flex items-center justify-between px-6" />;

  return (
    <>
      <header className="h-16 border-b border-white/5 glass flex items-center justify-between px-4 sm:px-6 z-50 relative">
        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium text-zinc-400 hidden sm:block">Mission Status</h2>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-bold">Day {stats.currentDay}/50</span>
          </div>
          
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          
          <div className="flex items-center gap-2 hidden sm:flex">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-bold">{stats.streak} Streak</span>
          </div>
          
          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2 hidden sm:flex">
            <Target className="h-4 w-4 text-indigo-400" />
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
              Readiness: {stats.readinessScore}%
            </Badge>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-72 bg-[#0a0a0a] border-r border-white/5 z-50 md:hidden flex flex-col"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="h-8 w-8 rounded bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                    <span className="font-bold text-white tracking-tighter text-xs">X50</span>
                  </div>
                  <span className="text-lg font-bold tracking-tight">InternX50</span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Stats */}
              <div className="p-4 border-b border-white/5 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs">
                  <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="font-bold">Day {stats.currentDay}/50</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span className="font-bold">{stats.streak}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Target className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="font-bold text-indigo-300">{stats.readinessScore}%</span>
                </div>
              </div>
              
              <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 relative",
                        isActive 
                          ? "bg-white/10 text-white" 
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-full" />
                      )}
                      <item.icon className={cn("h-4 w-4", isActive ? "text-indigo-400" : "")} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/5">
                <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3">
                  <p className="text-xs font-semibold text-indigo-300 mb-0.5">50 Days Mission</p>
                  <p className="text-[10px] text-zinc-400">Consistency is the only metric that matters.</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
