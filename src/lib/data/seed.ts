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

export const communicationTasksData = [
  { day: 1, theme: 'Introspection', prompt: 'Describe a time you failed miserably at something important to you.', twist: 'Defend why that failure was actually the best possible outcome, even if it negatively impacted others at the time.' },
  { day: 2, theme: 'Introspection', prompt: 'What is your greatest, most genuine weakness?', twist: 'You cannot use a disguised strength like being a perfectionist. You must detail a specific moment this weakness actively cost you a valuable opportunity.' },
  { day: 3, theme: 'Introspection', prompt: 'Discuss a deeply held personal belief that you have recently changed your mind about.', twist: 'Dedicate at least two continuous minutes of your speech to arguing passionately against your new belief.' },
  { day: 4, theme: 'Introspection', prompt: 'Describe a significant conflict you had with an authority figure or mentor.', twist: 'Assume the authority figure was 100 percent correct. Deconstruct how your behavior looked from their perspective.' },
  { day: 5, theme: 'Introspection', prompt: 'What does a highly successful life look like to you?', twist: 'You must remove money, job titles, and societal status from your definition entirely.' },
  { day: 6, theme: 'Introspection', prompt: 'Talk about a time you had to collaborate with someone you strongly disliked.', twist: 'Identify and analyze three positive character traits about this person that you currently lack.' },
  { day: 7, theme: 'Introspection', prompt: 'Explain your most complex hobby or interest to a five-year-old.', twist: 'Halfway through, pivot your tone and explain why this hobby reveals a dark or difficult truth about human nature.' },
  { day: 8, theme: 'Ethics & Society', prompt: 'Is it ever acceptable to lie in a professional or academic setting?', twist: 'Construct a detailed hypothetical scenario where telling the truth is the objectively unethical choice.' },
  { day: 9, theme: 'Ethics & Society', prompt: 'How is social media shaping the work ethic of your generation?', twist: 'Argue that social media is actually creating a significantly more resilient and adaptable workforce.' },
  { day: 10, theme: 'Ethics & Society', prompt: 'Privacy versus Security: Which is fundamentally more important?', twist: 'Argue your chosen position entirely from the perspective of a parent trying to protect a vulnerable child.' },
  { day: 11, theme: 'Ethics & Society', prompt: 'If you could implement one irreversible global law, what would it be?', twist: 'Spend the second half of your speech detailing the devastating, unintended consequences of your own law.' },
  { day: 12, theme: 'Ethics & Society', prompt: 'Does modern technology isolate us or connect us?', twist: 'You must argue that the human concept of connection has permanently evolved, rendering the old definition obsolete.' },
  { day: 13, theme: 'Ethics & Society', prompt: 'Describe a time you saw someone being treated unfairly but did nothing.', twist: 'Justify your inaction using pure logical reasoning, without using fear or anxiety as an excuse.' },
  { day: 14, theme: 'Ethics & Society', prompt: 'What is the value of loyalty in the modern workplace?', twist: 'Argue that company loyalty is a toxic, outdated concept designed solely to exploit young professionals.' },
  { day: 15, theme: 'Abstract Dilemmas', prompt: 'You are a manager forced to lay off exactly half of your team. How do you choose who stays?', twist: 'You are strictly forbidden from using past performance metrics or seniority as your criteria.' },
  { day: 16, theme: 'Abstract Dilemmas', prompt: 'Defend a highly controversial or unpopular opinion that you genuinely hold.', twist: 'Address the most intelligent, compassionate counter-argument against your opinion and dismantle it respectfully.' },
  { day: 17, theme: 'Abstract Dilemmas', prompt: 'If you had to sacrifice one of your core personal values to save your career, which one goes?', twist: 'Explain exactly how you would justify this compromise to yourself and live with the guilt afterward.' },
  { day: 18, theme: 'Abstract Dilemmas', prompt: 'Explain how you would solve the classic trolley problem if the one person on the alternate track was a close friend.', twist: 'Explain your choice purely through the lens of evolutionary biology and survival strategy, ignoring all emotion.' },
  { day: 19, theme: 'Abstract Dilemmas', prompt: 'Is intense ambition a virtue or a vice?', twist: 'Focus your entire response on the collateral damage caused by your own personal ambition up to this point in your life.' },
  { day: 20, theme: 'Abstract Dilemmas', prompt: 'You are given absolute, unchecked power over your city for 24 hours. What happens?', twist: 'Focus entirely on the severe psychological toll this power takes on you, rather than the specific actions you take.' },
  { day: 21, theme: 'Abstract Dilemmas', prompt: 'How do you handle a colleague who repeatedly takes credit for your work?', twist: 'You cannot confront them directly, and you cannot involve management. Detail a strategic plan to regain your leverage.' },
  { day: 22, theme: 'Professional Scenarios', prompt: 'Describe a project or group assignment you led that went completely off the rails.', twist: 'Take 100 percent of the blame, even for external factors entirely outside your control, and explain how you would fix it now.' },
  { day: 23, theme: 'Professional Scenarios', prompt: 'You discover your employer is doing something slightly unethical but highly profitable. What is your move?', twist: 'Argue why the most moral choice is to stay and change the culture from the inside rather than simply quitting.' },
  { day: 24, theme: 'Professional Scenarios', prompt: 'A major client demands a deadline that is physically impossible for your team to meet.', twist: 'You must say yes to the client without setting your team up for burnout. Explain the illusion you will construct to manage this.' },
  { day: 25, theme: 'Professional Scenarios', prompt: 'How do you motivate a deeply apathetic, underperforming team member?', twist: 'You have zero budget for financial incentives and you do not have the authority to fire them.' },
  { day: 26, theme: 'Professional Scenarios', prompt: 'You have just been promoted to manage a team that includes your former mentor.', twist: 'Roleplay the exact conversation where you establish your new authority without destroying your previous relationship.' },
  { day: 27, theme: 'Professional Scenarios', prompt: 'You need to give critical feedback to a manager who is a severe micromanager.', twist: 'Frame your feedback strategy in a way that manipulates them into thinking that giving you autonomy was their own idea.' },
  { day: 28, theme: 'Professional Scenarios', prompt: 'Pitch me an inherently terrible business idea but convince me it is genius.', twist: 'The idea must be genuinely flawed, but your logical progression and rhetorical delivery must be flawlessly structured.' },
  { day: 29, theme: 'The Finale', prompt: 'Summarize your entire philosophy on life and work in under ten minutes.', twist: 'You are forbidden from using abstract nouns like love, success, happiness, or peace. You must use only concrete, physical examples.' },
  { day: 30, theme: 'The Finale', prompt: 'Why should an employer hire you over one hundred identical 21-year-old candidates?', twist: 'Assume the interviewer actively dislikes your resume. Win them over using only your unique perspective on navigating failure.' }
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

  const commData = day <= 30 ? communicationTasksData[day - 1] : null;
  const commTitle = commData ? `Communication: ${commData.theme}` : 'Communication & Behavioral';
  const commDesc = commData ? `**Prompt:** ${commData.prompt}\n\n**The Twist:** ${commData.twist}` : 'Practice answering 2 STAR format questions aloud.';

  const tasks: Task[] = [
    {
      id: `task-${day}-dsa`,
      title: `DSA Practice`,
      description: 'Click the edit icon to add your specific questions or topics for today.',
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
      description: 'Click the edit icon to specify the GATE topic you will cover today.',
      category: 'GATE',
      durationMinutes: 120,
      difficulty: 'Medium',
      priority: 3,
      status: 'Pending',
      failedCount: 0,
    },
    {
      id: `task-${day}-ml`,
      title: `ML/DL Practice`,
      description: 'Click the edit icon to add your specific ML/DL topic for today.',
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
      title: commTitle,
      description: commDesc,
      category: 'Communication',
      durationMinutes: 30,
      difficulty: 'Medium',
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
