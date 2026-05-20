'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { Mic, User, Server, BookOpen, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useState } from 'react';

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
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleRate = (q: string, value: number[]) => {
    setRatings(prev => ({ ...prev, [q]: value[0] }));
  };

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
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
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
          <p className="text-zinc-400 mt-1">Refine your delivery. Confidence is key.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass p-4 rounded-xl border border-pink-500/20 bg-pink-500/5 text-center">
            <Star className="h-6 w-6 text-pink-400 mx-auto mb-2" />
            <h3 className="font-bold">Avg. Confidence</h3>
            <p className="text-2xl font-bold text-pink-400 mt-1">7.2 <span className="text-sm font-normal text-pink-400/50">/ 10</span></p>
          </div>
          <div className="glass p-4 rounded-xl border border-white/5 text-center">
            <User className="h-6 w-6 text-zinc-400 mx-auto mb-2" />
            <h3 className="font-bold">Mock Interviews</h3>
            <p className="text-2xl font-bold mt-1">2 <span className="text-sm font-normal text-zinc-500">Completed</span></p>
          </div>
          <div className="glass p-4 rounded-xl border border-white/5 text-center">
            <Server className="h-6 w-6 text-zinc-400 mx-auto mb-2" />
            <h3 className="font-bold">Drafted Answers</h3>
            <p className="text-2xl font-bold mt-1">8 <span className="text-sm font-normal text-zinc-500">Saved</span></p>
          </div>
        </div>

        <Tabs defaultValue="hr" className="w-full">
          <TabsList className="glass bg-white/5 border border-white/10 w-full justify-start overflow-x-auto">
            <TabsTrigger value="hr" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Behavioral / HR
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
    </PageTransition>
  );
}
