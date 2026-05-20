import { DayPlan, Task, TaskCategory } from '../types';

function generateDailyTasks(day: number, phase: number): Task[] {
  const dsaTopics = ['Arrays', 'Strings', 'Hashing', 'Two Pointers', 'Sliding Window', 'Stack', 'Queue', 'Linked List', 'Trees', 'Graphs', 'Binary Search', 'Dynamic Programming'];
  const mlTopics = ['Regression', 'Classification', 'Decision Trees', 'Random Forest', 'XGBoost', 'SVM', 'Clustering', 'PCA', 'Metrics'];
  const dlTopics = ['Neural Networks', 'Backprop', 'CNNs', 'RNNs', 'LSTMs', 'Transformers', 'Optimizers', 'BatchNorm & Dropout'];
  
  const dsaIndex = Math.floor((day - 1) / 4) % dsaTopics.length;
  const mlIndex = Math.floor((day - 1) / 3) % mlTopics.length;
  const dlIndex = Math.floor((day - 25) / 3) % dlTopics.length;

  const isDL = day > 25;
  const coreTopic = isDL ? dlTopics[dlIndex] : mlTopics[mlIndex];

  const tasks: Task[] = [
    {
      id: `task-${day}-1`,
      title: `DSA Practice: ${dsaTopics[dsaIndex]}`,
      description: 'Solve 3-5 standard LeetCode problems (Medium/Hard). Focus on pattern recognition.',
      category: 'DSA',
      durationMinutes: 180,
      completed: false,
    },
    {
      id: `task-${day}-2`,
      title: 'GATE Revision & Practice',
      description: 'Cover fundamental topics in OS, DBMS, or CN. Practice previous year questions.',
      category: 'GATE',
      durationMinutes: 120,
      completed: false,
    },
    {
      id: `task-${day}-3`,
      title: `Core Concept: ${coreTopic}`,
      description: 'Revise theory, mathematical intuition, and implement a quick script from scratch.',
      category: 'ML/DL',
      durationMinutes: 90,
      completed: false,
    },
    {
      id: `task-${day}-4`,
      title: 'Communication & Behavioral',
      description: 'Practice answering 2 STAR format questions aloud. Record and review yourself.',
      category: 'Communication',
      durationMinutes: 30,
      completed: false,
    }
  ];

  if (phase === 2 && day % 3 === 0) {
    tasks.push({
      id: `task-${day}-5`,
      title: 'Project Building Sprint',
      description: 'Work on your core ML/DL portfolio project. Commit code to GitHub.',
      category: 'Projects',
      durationMinutes: 120,
      completed: false,
    });
  }

  if (phase === 3 && day % 2 === 0) {
    tasks.push({
      id: `task-${day}-6`,
      title: 'Mock Interview / OA Simulation',
      description: 'Take a timed 90-minute OA simulation or conduct a mock interview with a peer.',
      category: 'OA/Mock',
      durationMinutes: 90,
      completed: false,
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
