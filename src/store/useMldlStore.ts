import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TheoryTopic {
  id: string;
  name: string;
  category: 'ML' | 'DL';
  completed: boolean;
  confidenceScore: number; // 0 to 100
  needsPractice: boolean;
  bookmarked: boolean;
  notes: string;
  lastRevised: string; // date string or "Never"
  lastRevisedTimestamp: number; // timestamp
}

export interface PracticeTopic {
  id: string;
  name: string;
  practiceCount: number;
  confidence: number; // 0 to 100
  lastPracticed: string; // date string or "Never"
  lastPracticedTimestamp: number;
  bugsFaced: string;
  notes: string;
  completed: boolean;
}

export interface MiniTask {
  id: string;
  title: string;
  objective: string;
  datasetInfo: string;
  estimatedDuration: string; // e.g. "2 hours"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  githubLink: string;
  notes: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'ML Fundamentals' | 'DL Fundamentals' | 'Practical ML' | 'Project Discussion' | 'Debugging Questions';
  question: string;
  selfRating: number; // 1 to 5
  answeredConfidently: boolean;
  notes: string;
  bookmarked: boolean;
  revisionNeeded: boolean;
}

export interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  timeSpent: number; // in minutes
  notes: string;
}

interface MldlState {
  theoryTopics: TheoryTopic[];
  practiceTopics: PracticeTopic[];
  miniTasks: MiniTask[];
  interviewQuestions: InterviewQuestion[];
  dailyGoals: DailyGoal[];
  
  // Actions
  updateTheoryTopic: (id: string, updates: Partial<TheoryTopic>) => void;
  updatePracticeTopic: (id: string, updates: Partial<PracticeTopic>) => void;
  updateMiniTask: (id: string, updates: Partial<MiniTask>) => void;
  updateInterviewQuestion: (id: string, updates: Partial<InterviewQuestion>) => void;
  updateDailyGoal: (id: string, updates: Partial<DailyGoal>) => void;
  
  addDailyGoal: (title: string) => void;
  deleteDailyGoal: (id: string) => void;
  
  // Utility trigger
  markTheoryRevised: (id: string) => void;
  markPracticeDone: (id: string, confidence: number, bugs: string, notes: string) => void;
}

const initialTheoryTopics: TheoryTopic[] = [
  // ML Theory
  { id: 'ml-linear', name: 'Linear Regression', category: 'ML', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'ml-logistic', name: 'Logistic Regression', category: 'ML', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'ml-trees', name: 'Decision Trees', category: 'ML', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'ml-forest', name: 'Random Forest', category: 'ML', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'ml-xgboost', name: 'XGBoost', category: 'ML', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'ml-svm', name: 'SVM', category: 'ML', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'ml-knn', name: 'KNN', category: 'ML', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'ml-biasvar', name: 'Bias vs Variance', category: 'ML', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'ml-regularization', name: 'Regularization', category: 'ML', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'ml-crossval', name: 'Cross Validation', category: 'ML', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'ml-metrics', name: 'Metrics', category: 'ML', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },

  // DL Theory
  { id: 'dl-perceptron', name: 'Perceptron', category: 'DL', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-ann', name: 'ANN', category: 'DL', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-cnn', name: 'CNN', category: 'DL', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-rnn', name: 'RNN', category: 'DL', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-lstm', name: 'LSTM', category: 'DL', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-transformers', name: 'Transformers basics', category: 'DL', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-activation', name: 'Activation Functions', category: 'DL', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-optimizers', name: 'Optimizers', category: 'DL', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-batchnorm', name: 'BatchNorm', category: 'DL', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-dropout', name: 'Dropout', category: 'DL', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-overfitting', name: 'Overfitting', category: 'DL', completed: false, confidenceScore: 0, needsPractice: false, bookmarked: false, notes: '', lastRevised: 'Never', lastRevisedTimestamp: 0 }
];

const initialPracticeTopics: PracticeTopic[] = [
  { id: 'prac-preprocessing', name: 'Preprocessing', practiceCount: 0, confidence: 0, lastPracticed: 'Never', lastPracticedTimestamp: 0, bugsFaced: '', notes: '', completed: false },
  { id: 'prac-feature', name: 'Feature Engineering', practiceCount: 0, confidence: 0, lastPracticed: 'Never', lastPracticedTimestamp: 0, bugsFaced: '', notes: '', completed: false },
  { id: 'prac-pipelines', name: 'Sklearn Pipelines', practiceCount: 0, confidence: 0, lastPracticed: 'Never', lastPracticedTimestamp: 0, bugsFaced: '', notes: '', completed: false },
  { id: 'prac-split', name: 'Train/Test Split', practiceCount: 0, confidence: 0, lastPracticed: 'Never', lastPracticedTimestamp: 0, bugsFaced: '', notes: '', completed: false },
  { id: 'prac-metrics', name: 'Evaluation Metrics', practiceCount: 0, confidence: 0, lastPracticed: 'Never', lastPracticedTimestamp: 0, bugsFaced: '', notes: '', completed: false },
  { id: 'prac-tuning', name: 'Hyperparameter Tuning', practiceCount: 0, confidence: 0, lastPracticed: 'Never', lastPracticedTimestamp: 0, bugsFaced: '', notes: '', completed: false },
  { id: 'prac-cnn', name: 'CNN Implementation', practiceCount: 0, confidence: 0, lastPracticed: 'Never', lastPracticedTimestamp: 0, bugsFaced: '', notes: '', completed: false },
  { id: 'prac-pytorch', name: 'PyTorch/TensorFlow Basics', practiceCount: 0, confidence: 0, lastPracticed: 'Never', lastPracticedTimestamp: 0, bugsFaced: '', notes: '', completed: false }
];

const initialMiniTasks: MiniTask[] = [
  { id: 'task-titanic', title: 'Titanic Classification', objective: 'Predict survival using random forests, handling missing ages and ticket details.', datasetInfo: 'Titanic dataset from Kaggle (891 rows, binary target)', estimatedDuration: '2 hours', difficulty: 'Easy', completed: false, githubLink: '', notes: '' },
  { id: 'task-house', title: 'House Price Prediction', objective: 'Predict continuous pricing using regularized regression and XGBoost, fixing skewness.', datasetInfo: 'Ames Housing dataset (79 features, continuous target)', estimatedDuration: '3 hours', difficulty: 'Medium', completed: false, githubLink: '', notes: '' },
  { id: 'task-mnist', title: 'MNIST Classification', objective: 'Build a custom PyTorch CNN to classify handwritten digits with >99% validation accuracy.', datasetInfo: 'MNIST (70k grayscale 28x28 images, 10 classes)', estimatedDuration: '2 hours', difficulty: 'Easy', completed: false, githubLink: '', notes: '' },
  { id: 'task-spam', title: 'Spam Detection', objective: 'Use TF-IDF feature vectors and Naive Bayes to classify SMS messages as spam or ham.', datasetInfo: 'SMS Spam Collection (5.5k messages, text)', estimatedDuration: '2.5 hours', difficulty: 'Medium', completed: false, githubLink: '', notes: '' },
  { id: 'task-churn', title: 'Customer Churn Prediction', objective: 'Train classification models (XGBoost vs Logistic Regression) and evaluate using ROC-AUC.', datasetInfo: 'Telco Churn Dataset (7k rows, high class imbalance)', estimatedDuration: '4 hours', difficulty: 'Hard', completed: false, githubLink: '', notes: '' }
];

const initialInterviewQuestions: InterviewQuestion[] = [
  { id: 'q-rf-dt', category: 'ML Fundamentals', question: 'Why Random Forest over Decision Tree?', selfRating: 0, answeredConfidently: false, notes: '', bookmarked: false, revisionNeeded: false },
  { id: 'q-overfitting', category: 'ML Fundamentals', question: 'What is overfitting and how do you reduce it?', selfRating: 0, answeredConfidently: false, notes: '', bookmarked: false, revisionNeeded: false },
  { id: 'q-relu', category: 'DL Fundamentals', question: 'Why ReLU over Sigmoid or Tanh in hidden layers?', selfRating: 0, answeredConfidently: false, notes: '', bookmarked: false, revisionNeeded: false },
  { id: 'q-biasvar', category: 'ML Fundamentals', question: 'Explain bias-variance tradeoff.', selfRating: 0, answeredConfidently: false, notes: '', bookmarked: false, revisionNeeded: false },
  { id: 'q-pipeline', category: 'Practical ML', question: 'Explain your ML pipeline. How do you prevent data leakage?', selfRating: 0, answeredConfidently: false, notes: '', bookmarked: false, revisionNeeded: false },
  { id: 'q-dead-relu', category: 'Debugging Questions', question: 'What is the "dying ReLU" problem and how can you fix it?', selfRating: 0, answeredConfidently: false, notes: '', bookmarked: false, revisionNeeded: false },
  { id: 'q-transformer-attn', category: 'DL Fundamentals', question: 'Explain self-attention in Transformers.', selfRating: 0, answeredConfidently: false, notes: '', bookmarked: false, revisionNeeded: false }
];

const initialDailyGoals: DailyGoal[] = [
  { id: 'goal-1', title: 'Revise Logistic Regression theory & loss math', completed: false, timeSpent: 0, notes: '' },
  { id: 'goal-2', title: 'Implement train/test split from scratch in NumPy', completed: false, timeSpent: 0, notes: '' },
  { id: 'goal-3', title: 'Solve 3 DL fundamentals questions from Interview Bank', completed: false, timeSpent: 0, notes: '' },
  { id: 'goal-4', title: 'Read about Transformer Self-Attention', completed: false, timeSpent: 0, notes: '' }
];

export const useMldlStore = create<MldlState>()(
  persist(
    (set, get) => ({
      theoryTopics: initialTheoryTopics,
      practiceTopics: initialPracticeTopics,
      miniTasks: initialMiniTasks,
      interviewQuestions: initialInterviewQuestions,
      dailyGoals: initialDailyGoals,

      updateTheoryTopic: (id, updates) => set((state) => ({
        theoryTopics: state.theoryTopics.map(t => t.id === id ? { ...t, ...updates } : t)
      })),

      updatePracticeTopic: (id, updates) => set((state) => ({
        practiceTopics: state.practiceTopics.map(t => t.id === id ? { ...t, ...updates } : t)
      })),

      updateMiniTask: (id, updates) => set((state) => ({
        miniTasks: state.miniTasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),

      updateInterviewQuestion: (id, updates) => set((state) => ({
        interviewQuestions: state.interviewQuestions.map(q => q.id === id ? { ...q, ...updates } : q)
      })),

      updateDailyGoal: (id, updates) => set((state) => ({
        dailyGoals: state.dailyGoals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),

      addDailyGoal: (title) => set((state) => ({
        dailyGoals: [
          ...state.dailyGoals,
          {
            id: `goal-${Date.now()}`,
            title,
            completed: false,
            timeSpent: 0,
            notes: ''
          }
        ]
      })),

      deleteDailyGoal: (id) => set((state) => ({
        dailyGoals: state.dailyGoals.filter(g => g.id !== id)
      })),

      markTheoryRevised: (id) => set((state) => {
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return {
          theoryTopics: state.theoryTopics.map(t => 
            t.id === id 
              ? { 
                  ...t, 
                  completed: true, 
                  confidenceScore: Math.min(100, t.confidenceScore + 15), 
                  needsPractice: false,
                  lastRevised: today,
                  lastRevisedTimestamp: Date.now()
                } 
              : t
          )
        };
      }),

      markPracticeDone: (id, confidence, bugs, notes) => set((state) => {
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return {
          practiceTopics: state.practiceTopics.map(p => 
            p.id === id 
              ? {
                  ...p,
                  practiceCount: p.practiceCount + 1,
                  confidence: confidence,
                  bugsFaced: bugs,
                  notes: notes,
                  completed: true,
                  lastPracticed: today,
                  lastPracticedTimestamp: Date.now()
                }
              : p
          )
        };
      })
    }),
    {
      name: 'internx50-mldl-prep-v2',
    }
  )
);

// Derives state metrics dynamically
export function useMldlMetrics() {
  const { theoryTopics, practiceTopics, miniTasks, interviewQuestions, dailyGoals } = useMldlStore();

  // Completion calculation
  const totalTheory = theoryTopics.length;
  const completedTheory = theoryTopics.filter(t => t.completed).length;

  const totalPractice = practiceTopics.length;
  const completedPractice = practiceTopics.filter(p => p.completed).length;

  const totalMini = miniTasks.length;
  const completedMini = miniTasks.filter(t => t.completed).length;

  const totalQuestions = interviewQuestions.length;
  const answeredConfidently = interviewQuestions.filter(q => q.answeredConfidently).length;

  const overallCompletionPercent = totalTheory + totalPractice + totalMini + totalQuestions > 0
    ? Math.round(
        ((completedTheory + completedPractice + completedMini + answeredConfidently) /
        (totalTheory + totalPractice + totalMini + totalQuestions)) * 100
      )
    : 0;

  // Weakest topic: lowest confidence theory topic
  const sortedByConfidence = [...theoryTopics].sort((a, b) => a.confidenceScore - b.confidenceScore);
  const weakestTopic = sortedByConfidence.length > 0 ? sortedByConfidence[0] : null;

  // Current focus: lowest confidence topic that is NOT completed
  const incompleteSorted = theoryTopics.filter(t => !t.completed).sort((a, b) => a.confidenceScore - b.confidenceScore);
  const currentFocusTopic = incompleteSorted.length > 0 
    ? incompleteSorted[0] 
    : (sortedByConfidence.length > 0 ? sortedByConfidence[0] : null);

  // Revision logic:
  // - Confidence score < 40
  // - Marked "needsPractice" in theory topics
  // - Marked "revisionNeeded" in interview questions
  // - Not revised in the last 7 days (604,800,000 ms) and is completed
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  
  const revisionQueue = [
    ...theoryTopics.filter(t => 
      t.confidenceScore < 40 || 
      t.needsPractice || 
      (t.completed && t.lastRevisedTimestamp < sevenDaysAgo)
    ).map(t => ({
      id: t.id,
      type: 'Theory' as const,
      name: t.name,
      reason: t.confidenceScore < 40 
        ? `Low confidence (${t.confidenceScore}%)` 
        : t.needsPractice 
        ? 'Flagged for practice' 
        : 'Not revised in 7 days',
      confidence: t.confidenceScore
    })),
    ...interviewQuestions.filter(q => q.revisionNeeded || q.selfRating <= 2).map(q => ({
      id: q.id,
      type: 'Question' as const,
      name: q.question,
      reason: q.revisionNeeded ? 'Marked for revision' : `Low self-rating (${q.selfRating}/5)`,
      confidence: q.selfRating * 20
    }))
  ];

  // Interview Readiness Score logic
  // Based on:
  // - Theory completion (25%)
  // - Practice completion (25%)
  // - Mini Tasks completion (20%)
  // - Interview questions rating (avg score scaled to 100) (20%)
  // - Active daily goals completion rate (10%)
  const theoryWeight = (completedTheory / (totalTheory || 1)) * 25;
  const practiceWeight = (completedPractice / (totalPractice || 1)) * 25;
  const miniWeight = (completedMini / (totalMini || 1)) * 20;
  
  const avgQRating = totalQuestions > 0 
    ? interviewQuestions.reduce((acc, q) => acc + q.selfRating, 0) / totalQuestions 
    : 0; // max 5
  const qWeight = (avgQRating / 5) * 20;

  const totalGoals = dailyGoals.length;
  const completedGoals = dailyGoals.filter(g => g.completed).length;
  const goalsWeight = totalGoals > 0 ? (completedGoals / totalGoals) * 10 : 10;

  const readinessScore = Math.min(100, Math.round(theoryWeight + practiceWeight + miniWeight + qWeight + goalsWeight));

  return {
    overallCompletionPercent,
    weakestTopicName: weakestTopic ? weakestTopic.name : 'None',
    weakestTopicConfidence: weakestTopic ? weakestTopic.confidenceScore : 0,
    currentFocusTopicName: currentFocusTopic ? currentFocusTopic.name : 'None',
    revisionQueue,
    readinessScore
  };
}
