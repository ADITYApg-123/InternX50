import { DayPlan, Task, TopicMastery } from '../types';

export const dsaTopicsData = [
  { id: 'dsa-arrays', name: 'Arrays & Hashing' },
  { id: 'dsa-pointers', name: 'Two Pointers' },
  { id: 'dsa-window', name: 'Sliding Window' },
  { id: 'dsa-stack', name: 'Stack & Queue' },
  { id: 'dsa-search', name: 'Binary Search' },
  { id: 'dsa-ll', name: 'Linked List' },
  { id: 'dsa-trees', name: 'Trees' },
  { id: 'dsa-graphs', name: 'Graphs' },
  { id: 'dsa-dp', name: 'Dynamic Programming' },
];

export const mlTopicsData = [
  { id: 'ml-regression', name: 'Linear / Logistic Regression' },
  { id: 'ml-trees', name: 'Decision Trees & Random Forest' },
  { id: 'ml-boost', name: 'XGBoost & Gradient Boosting' },
  { id: 'ml-svm', name: 'SVM & Kernels' },
  { id: 'ml-metrics', name: 'Evaluation Metrics' },
];

export const dlTopicsData = [
  { id: 'dl-basics', name: 'Neural Network Basics' },
  { id: 'dl-cnn', name: 'CNN Architectures' },
  { id: 'dl-rnn', name: 'RNNs & LSTMs' },
  { id: 'dl-trans', name: 'Transformers & Attention' },
  { id: 'dl-opt', name: 'Optimizers' },
];

export function generateInitialTopics(): Record<string, TopicMastery> {
  const topics: Record<string, TopicMastery> = {};
  
  [...dsaTopicsData].forEach(t => {
    topics[t.id] = { topicId: t.id, name: t.name, category: 'DSA', solvedCount: 0, totalQuestions: 30, confidenceScore: 0, lastRevisionDay: null, weakPatterns: [] };
  });
  
  [...mlTopicsData, ...dlTopicsData].forEach(t => {
    topics[t.id] = { topicId: t.id, name: t.name, category: 'ML/DL', solvedCount: 0, totalQuestions: 15, confidenceScore: 0, lastRevisionDay: null, weakPatterns: [] };
  });

  return topics;
}

function generateDailyTasks(day: number, phase: number): Task[] {
  const dsaIndex = Math.floor((day - 1) / 4) % dsaTopicsData.length;
  const mlIndex = Math.floor((day - 1) / 3) % mlTopicsData.length;
  const dlIndex = Math.floor((day - 25) / 3) % dlTopicsData.length;

  const isDL = day > 25;
  const coreTopic = isDL ? dlTopicsData[dlIndex] : mlTopicsData[mlIndex];
  const dsaTopic = dsaTopicsData[dsaIndex];

  const tasks: Task[] = [
    {
      id: `task-${day}-dsa`,
      title: `DSA Practice: ${dsaTopic.name}`,
      description: 'Solve 3-5 standard LeetCode problems. Focus on pattern recognition.',
      category: 'DSA',
      durationMinutes: 180,
      difficulty: 'Medium',
      priority: 1,
      status: 'Pending',
      topicId: dsaTopic.id,
      confidenceImpact: 15,
      failedCount: 0,
    },
    {
      id: `task-${day}-gate`,
      title: 'GATE Revision & Practice',
      description: 'Cover fundamental topics in OS, DBMS, or CN.',
      category: 'GATE',
      durationMinutes: 120,
      difficulty: 'Medium',
      priority: 3,
      status: 'Pending',
      failedCount: 0,
    },
    {
      id: `task-${day}-ml`,
      title: `Core Concept: ${coreTopic.name}`,
      description: 'Revise theory, mathematical intuition, and implement from scratch.',
      category: 'ML/DL',
      durationMinutes: 90,
      difficulty: 'Medium',
      priority: 2,
      status: 'Pending',
      topicId: coreTopic.id,
      confidenceImpact: 20,
      failedCount: 0,
    },
    {
      id: `task-${day}-comm`,
      title: 'Communication & Behavioral',
      description: 'Practice answering 2 STAR format questions aloud.',
      category: 'Communication',
      durationMinutes: 30,
      difficulty: 'Easy',
      priority: 4,
      status: 'Pending',
      failedCount: 0,
    }
  ];

  if (phase >= 2 && day % 3 === 0) {
    tasks.push({
      id: `task-${day}-proj`,
      title: 'Project Building Sprint',
      description: 'Work on your core ML/DL portfolio project. Commit code to GitHub.',
      category: 'Projects',
      durationMinutes: 120,
      difficulty: 'Hard',
      priority: 1,
      status: 'Pending',
      failedCount: 0,
    });
  }

  if (phase === 3 && day % 2 === 0) {
    tasks.push({
      id: `task-${day}-mock`,
      title: 'Mock Interview / OA Simulation',
      description: 'Take a timed 90-minute OA simulation.',
      category: 'OA/Mock',
      durationMinutes: 90,
      difficulty: 'Hard',
      priority: 1,
      status: 'Pending',
      failedCount: 0,
    });
  }

  return tasks;
}

export function generateRoadmap(): DayPlan[] {
  const roadmap: DayPlan[] = [];

  for (let i = 1; i <= 50; i++) {
    let phase = 1;
    let title = 'Foundation & Fundamentals';
    
    if (i >= 13 && i <= 30) {
      phase = 2;
      title = 'Projects & Core Execution';
    } else if (i > 30) {
      phase = 3;
      title = 'Interview Prep & Simulation';
    }

    roadmap.push({
      dayNumber: i,
      title: `Day ${i}: ${title}`,
      phase,
      tasks: generateDailyTasks(i, phase),
    });
  }

  return roadmap;
}
