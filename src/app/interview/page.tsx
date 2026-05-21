'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { Mic, User, Server, BookOpen, Star, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { MockInterview } from '@/lib/types';
import { cn } from '@/lib/utils';

const questions = {
  hr: [
    "Tell me about yourself.",
    "Why do you want to work in AI/ML?",
    "What is your biggest weakness?",
    "Tell me about a time you faced a significant challenge."
  ],
  ml: [
    "Explain the bias-variance tradeoff.",
    "How does a Transformer model work intuitively?",
    "What is the difference between Batch Norm and Layer Norm?",
    "How would you handle a highly imbalanced dataset?"
  ],
  project: [
    "Walk me through the architecture of your main project.",
    "What was the most challenging technical hurdle in your project?",
    "If you had more time, what would you improve in your system?",
    "Explain your choice of loss function for the model."
  ]
};

export default function InterviewPage() {
  const { mockInterviews, addMockInterview, recalculateReadiness } = useStore();
  const [mounted, setMounted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  
  // New Mock Form
  const [mockType, setMockType] = useState('Google Mock OA');
  const [mockConfidence, setMockConfidence] = useState(5);
  const [mockPassed, setMockPassed] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleRate = (q: string, value: number[]) => {
    setRatings(prev => ({ ...prev, [q]: value[0] }));
  };

  const handleSaveMock = () => {
    const newMock: MockInterview = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      companyOrType: mockType,
      confidenceRating: mockConfidence,
      passed: mockPassed,
      feedback: '',
    };
    addMockInterview(newMock);
    recalculateReadiness();
  };

  const avgConfidence = mockInterviews.length > 0 
    ? (mockInterviews.reduce((acc, m) => acc + m.confidenceRating, 0) / mockInterviews.length).toFixed(1)
    : '0.0';

  const renderQuestions = (qs: string[]) => (
    <div className="space-y-4 mt-6">
      {qs.map((q, i) => (
        <div key={i} className="glass p-5 rounded-xl border border-white/5 space-y-4">
          <h3 className="font-medium text-lg">{q}</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Needs Work</span>
              <span>Confidence: {ratings[q] || 0}/10</span>
              <span>Perfect Delivery</span>
            </div>
            <Slider 
              defaultValue={[0]} 
              max={10} 
              step={1} 
              value={[ratings[q] || 0]}
              onValueChange={(val) => handleRate(q, val as number[])}
              className="py-2"
            />
          </div>
          
          <div className="pt-2">
            <textarea 
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="Draft your bullet points here..."
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Mic className="text-pink-500 h-8 w-8" /> Interview Center
          </h1>
          <p className="text-zinc-400 mt-1">Refine your delivery. Log your mocks. Confidence is key.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass p-4 rounded-xl border border-pink-500/20 bg-pink-500/5 text-center">
            <Star className="h-6 w-6 text-pink-400 mx-auto mb-2" />
            <h3 className="font-bold">Avg. Mock Rating</h3>
            <p className="text-2xl font-bold text-pink-400 mt-1">{avgConfidence} <span className="text-sm font-normal text-pink-400/50">/ 10</span></p>
          </div>
          <div className="glass p-4 rounded-xl border border-white/5 text-center">
            <User className="h-6 w-6 text-zinc-400 mx-auto mb-2" />
            <h3 className="font-bold">Mock Interviews</h3>
            <p className="text-2xl font-bold mt-1">{mockInterviews.length} <span className="text-sm font-normal text-zinc-500">Completed</span></p>
          </div>
          <div className="glass p-4 rounded-xl border border-white/5 text-center">
            <Server className="h-6 w-6 text-zinc-400 mx-auto mb-2" />
            <h3 className="font-bold">Pass Rate</h3>
            <p className="text-2xl font-bold mt-1 text-emerald-400">
              {mockInterviews.length > 0 ? Math.round((mockInterviews.filter(m => m.passed).length / mockInterviews.length) * 100) : 0}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="hr" className="w-full">
              <TabsList className="glass bg-white/5 border border-white/10 w-full justify-start overflow-x-auto">
                <TabsTrigger value="hr" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Behavioral
                </TabsTrigger>
                <TabsTrigger value="ml" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Core ML/DL
                </TabsTrigger>
                <TabsTrigger value="project" className="flex items-center gap-2">
                  <Server className="h-4 w-4" /> Project Defense
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="hr">
                {renderQuestions(questions.hr)}
              </TabsContent>

              <TabsContent value="ml">
                {renderQuestions(questions.ml)}
              </TabsContent>

              <TabsContent value="project">
                {renderQuestions(questions.project)}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold">Log Mock Interview</h2>
            <div className="glass p-5 rounded-xl border border-white/5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Company / Type</label>
                <input 
                  type="text" 
                  value={mockType}
                  onChange={(e) => setMockType(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex justify-between">
                  <span>Confidence Rating</span>
                  <span>{mockConfidence}/10</span>
                </label>
                <Slider 
                  max={10} 
                  step={1} 
                  value={[mockConfidence]}
                  onValueChange={(val) => setMockConfidence((val as number[])[0])}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Result</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setMockPassed(true)}
                    className={cn("flex-1 py-2 rounded-lg text-xs font-medium border transition-colors", mockPassed ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "bg-white/5 border-white/10 hover:bg-white/10")}
                  >
                    Passed
                  </button>
                  <button 
                    onClick={() => setMockPassed(false)}
                    className={cn("flex-1 py-2 rounded-lg text-xs font-medium border transition-colors", !mockPassed ? "bg-red-500/20 text-red-400 border-red-500/50" : "bg-white/5 border-white/10 hover:bg-white/10")}
                  >
                    Failed
                  </button>
                </div>
              </div>

              <button 
                onClick={handleSaveMock}
                className="w-full py-2 rounded-lg bg-pink-500/10 text-pink-400 font-bold border border-pink-500/30 hover:bg-pink-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" /> Save Log
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold">Recent Logs</h3>
              {mockInterviews.length === 0 && <p className="text-sm text-zinc-500">No mock interviews logged yet.</p>}
              {[...mockInterviews].reverse().map(mock => (
                <div key={mock.id} className="glass p-3 rounded-lg border border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{mock.companyOrType}</h4>
                      <p className="text-xs text-zinc-500">{mock.date} • {mock.confidenceRating}/10 Rating</p>
                    </div>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded border", mock.passed ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>
                      {mock.passed ? "Passed" : "Failed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
