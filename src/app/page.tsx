'use client';
import { PageTransition } from '@/components/layout/PageTransition';
import { ArrowRight, Zap, Target, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto space-y-12 py-10">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 backdrop-blur-3xl">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
            50 Days. One Mission. Internship Ready.
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Stop consuming. <br className="hidden md:block"/> Start preparing.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-medium">
            The most structured, execution-oriented, interview-focused mission control center to crack AI/ML internships.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="w-full h-12 px-8 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
              Start Mission <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/10 w-full">
          <div className="glass p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 text-orange-500">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Deep Work Oriented</h3>
            <p className="text-sm text-zinc-400">Minimalist UI built to keep you in flow state. No cheap dopamine, just pure execution.</p>
          </div>
          
          <div className="glass p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Strict 50-Day Roadmap</h3>
            <p className="text-sm text-zinc-400">Every day planned out for you. DSA, Core ML/DL, CS Fundamentals, and Mock Interviews.</p>
          </div>

          <div className="glass p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Interview Ready</h3>
            <p className="text-sm text-zinc-400">Track mock interviews, behavioral questions, and visualize your readiness score.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
