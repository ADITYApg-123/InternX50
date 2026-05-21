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
  { id: 'ml-linear', name: 'Linear Regression', category: 'ML', completed: true, confidenceScore: 85, needsPractice: false, bookmarked: false, notes: 'Minimizes Mean Squared Error (MSE). Normal Equation: theta = (X^T X)^-1 X^T y. Assumptions: Linearity, independence, homoscedasticity, normality of residuals.', lastRevised: 'May 18, 2026', lastRevisedTimestamp: 1779148800000 },
  { id: 'ml-logistic', name: 'Logistic Regression', category: 'ML', completed: false, confidenceScore: 35, needsPractice: true, bookmarked: true, notes: 'Outputs probability using Sigmoid: 1 / (1 + e^-z). Loss: Binary Cross Entropy / Log Loss. Regularization (L1: Lasso / sparse, L2: Ridge / weight decay).', lastRevised: 'May 10, 2026', lastRevisedTimestamp: 1778457600000 },
  { id: 'ml-trees', name: 'Decision Trees', category: 'ML', completed: true, confidenceScore: 75, needsPractice: false, bookmarked: false, notes: 'Splitting criteria: Entropy, Gini Impurity, Information Gain. Pruning is key to avoid overfitting.', lastRevised: 'May 15, 2026', lastRevisedTimestamp: 1778889600000 },
  { id: 'ml-forest', name: 'Random Forest', category: 'ML', completed: true, confidenceScore: 80, needsPractice: false, bookmarked: false, notes: 'Ensemble bagging method. Reduces variance. Combines multiple deep trees trained on bootstrap samples with feature bagging.', lastRevised: 'May 16, 2026', lastRevisedTimestamp: 1778976000000 },
  { id: 'ml-xgboost', name: 'XGBoost', category: 'ML', completed: false, confidenceScore: 30, needsPractice: true, bookmarked: false, notes: 'Extreme Gradient Boosting. Sequential ensemble (boosting). Minimizes regularized objective. Uses Taylor expansion for approximation.', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'ml-svm', name: 'SVM', category: 'ML', completed: false, confidenceScore: 50, needsPractice: false, bookmarked: false, notes: 'Finds the optimal hyperplane that maximizes margin. Dual formulation. Kernel trick (RBF, Polynomial) maps data to higher dimensions.', lastRevised: 'May 12, 2026', lastRevisedTimestamp: 1778630400000 },
  { id: 'ml-knn', name: 'KNN', category: 'ML', completed: true, confidenceScore: 90, needsPractice: false, bookmarked: false, notes: 'Lazy learner. Non-parametric. Distance metrics: Euclidean, Manhattan. High computation cost at inference time.', lastRevised: 'May 19, 2026', lastRevisedTimestamp: 1779235200000 },
  { id: 'ml-biasvar', name: 'Bias vs Variance', category: 'ML', completed: true, confidenceScore: 95, needsPractice: false, bookmarked: true, notes: 'Bias: Error from erroneous assumptions (underfitting). Variance: Error from sensitivity to small fluctuations (overfitting). Total Error = Bias^2 + Variance + Irreducible Error.', lastRevised: 'May 20, 2026', lastRevisedTimestamp: 1779321600000 },
  { id: 'ml-regularization', name: 'Regularization', category: 'ML', completed: false, confidenceScore: 60, needsPractice: false, bookmarked: false, notes: 'Adds penalty term to loss function. L1 (Lasso) penalty absolute values -> yields sparse models. L2 (Ridge) penalty squared values -> shrinks weights towards zero.', lastRevised: 'May 14, 2026', lastRevisedTimestamp: 1778803200000 },
  { id: 'ml-crossval', name: 'Cross Validation', category: 'ML', completed: true, confidenceScore: 80, needsPractice: false, bookmarked: false, notes: 'K-Fold, Stratified K-Fold (for imbalanced classes), TimeSeriesSplit. Helps estimate generalization performance without leakages.', lastRevised: 'May 17, 2026', lastRevisedTimestamp: 1779062400000 },
  { id: 'ml-metrics', name: 'Metrics', category: 'ML', completed: false, confidenceScore: 45, needsPractice: true, bookmarked: false, notes: 'Classification: Accuracy, Precision, Recall, F1-score, ROC-AUC, Log Loss. Regression: MAE, MSE, RMSE, R-squared, Adjusted R-squared.', lastRevised: 'Never', lastRevisedTimestamp: 0 },

  // DL Theory
  { id: 'dl-perceptron', name: 'Perceptron', category: 'DL', completed: true, confidenceScore: 90, needsPractice: false, bookmarked: false, notes: 'Single-layer neural network. Can only solve linearly separable problems (cannot solve XOR). Update rule: w = w + eta * (y - y_hat) * x.', lastRevised: 'May 18, 2026', lastRevisedTimestamp: 1779148800000 },
  { id: 'dl-ann', name: 'ANN', category: 'DL', completed: true, confidenceScore: 80, needsPractice: false, bookmarked: false, notes: 'Multi-Layer Perceptron. Feedforward. Backpropagation calculates gradients using Chain Rule.', lastRevised: 'May 19, 2026', lastRevisedTimestamp: 1779235200000 },
  { id: 'dl-cnn', name: 'CNN', category: 'DL', completed: false, confidenceScore: 55, needsPractice: false, bookmarked: false, notes: 'Convolutional Neural Networks. Spatial hierarchies. Key layers: Conv (local receptive fields + weight sharing), Pooling (translation invariance), Fully Connected.', lastRevised: 'May 11, 2026', lastRevisedTimestamp: 1778544000000 },
  { id: 'dl-rnn', name: 'RNN', category: 'DL', completed: false, confidenceScore: 30, needsPractice: true, bookmarked: false, notes: 'Recurrent Neural Networks for sequential data. Vanishing/exploding gradient problems due to repeated multiplication of weight matrix W_hh over time.', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-lstm', name: 'LSTM', category: 'DL', completed: false, confidenceScore: 25, needsPractice: true, bookmarked: true, notes: 'Long Short-Term Memory. Solves vanishing gradients using constant error carousel. Gates: Forget gate (f_t), Input gate (i_t), Output gate (o_t), Cell state (C_t).', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-transformers', name: 'Transformers basics', category: 'DL', completed: false, confidenceScore: 20, needsPractice: true, bookmarked: true, notes: 'Attention Is All You Need. Self-Attention mechanism: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V. Multi-head attention allows attending to different subspaces.', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-activation', name: 'Activation Functions', category: 'DL', completed: true, confidenceScore: 85, needsPractice: false, bookmarked: false, notes: 'Sigmoid (0 to 1, saturates/vanishes), Tanh (-1 to 1, zero-centered), ReLU (max(0, x), avoids vanishing gradients, dead neurons problem), Leaky ReLU (adds small alpha slope).', lastRevised: 'May 19, 2026', lastRevisedTimestamp: 1779235200000 },
  { id: 'dl-optimizers', name: 'Optimizers', category: 'DL', completed: false, confidenceScore: 40, needsPractice: true, bookmarked: false, notes: 'SGD (stochastic gradient descent), Momentum (dampens oscillations), RMSprop (scales gradient by running average of squared gradients), Adam (combines momentum + RMSprop).', lastRevised: 'May 13, 2026', lastRevisedTimestamp: 1778716800000 },
  { id: 'dl-batchnorm', name: 'BatchNorm', category: 'DL', completed: false, confidenceScore: 35, needsPractice: true, bookmarked: false, notes: 'Normalizes activations of a layer across the batch. Reduces internal covariate shift. Speeds up training, acts as a mild regularizer.', lastRevised: 'Never', lastRevisedTimestamp: 0 },
  { id: 'dl-dropout', name: 'Dropout', category: 'DL', completed: true, confidenceScore: 90, needsPractice: false, bookmarked: false, notes: 'Randomly zeroes out neurons during training with probability p. Forces model to learn redundant representations, preventing overfitting.', lastRevised: 'May 20, 2026', lastRevisedTimestamp: 1779321600000 },
  { id: 'dl-overfitting', name: 'Overfitting', category: 'DL', completed: true, confidenceScore: 95, needsPractice: false, bookmarked: false, notes: 'When model memorizes training noise. Fixes: More data, regularization (L1/L2), Dropout, Early Stopping, Batch Normalization, data augmentation.', lastRevised: 'May 20, 2026', lastRevisedTimestamp: 1779321600000 }
];

const initialPracticeTopics: PracticeTopic[] = [
  { id: 'prac-preprocessing', name: 'Preprocessing', practiceCount: 4, confidence: 85, lastPracticed: 'May 17, 2026', lastPracticedTimestamp: 1779062400000, bugsFaced: 'Handling missing values dynamically in categorical columns vs numerical columns.', notes: 'StandardScaler vs MinMaxScaler. Imputer class from sklearn. SimpleImputer with strategy="median" for robustness.', completed: true },
  { id: 'prac-feature', name: 'Feature Engineering', practiceCount: 2, confidence: 70, lastPracticed: 'May 15, 2026', lastPracticedTimestamp: 1778889600000, bugsFaced: 'Data leakage when encoding target-based statistics before train/test split.', notes: 'One-hot encoding vs target encoding. Target encoding needs out-of-fold calculation to prevent leakage.', completed: true },
  { id: 'prac-pipelines', name: 'Sklearn Pipelines', practiceCount: 1, confidence: 50, lastPracticed: 'May 12, 2026', lastPracticedTimestamp: 1778630400000, bugsFaced: 'ColumnTransformer mismatch with fit_transform vs transform.', notes: 'Use Pipeline to wrap scaling, encoding, and model training. Always fit on train and transform on validation/test.', completed: false },
  { id: 'prac-split', name: 'Train/Test Split', practiceCount: 8, confidence: 95, lastPracticed: 'May 20, 2026', lastPracticedTimestamp: 1779321600000, bugsFaced: 'Forgetting stratify=y on highly imbalanced classification datasets.', notes: 'Manual implementation requires shuffling and slicing indices: train_idx = idx[:split], test_idx = idx[split:].', completed: true },
  { id: 'prac-metrics', name: 'Evaluation Metrics', practiceCount: 3, confidence: 75, lastPracticed: 'May 18, 2026', lastPracticedTimestamp: 1779148800000, bugsFaced: 'Confusion matrix dimensions mismatch when labels are not explicitly passed.', notes: 'Precision score, recall score, ROC curve, precision-recall curve. F1 score is harmonic mean.', completed: true },
  { id: 'prac-tuning', name: 'Hyperparameter Tuning', practiceCount: 1, confidence: 40, lastPracticed: 'May 08, 2026', lastPracticedTimestamp: 1778284800000, bugsFaced: 'GridSearchCV taking too long because of excessive search space.', notes: 'Prefer RandomizedSearchCV or Optuna for higher dimensional parameters. Optuna supports pruning trials.', completed: false },
  { id: 'prac-cnn', name: 'CNN Implementation', practiceCount: 0, confidence: 15, lastPracticed: 'Never', lastPracticedTimestamp: 0, bugsFaced: '', notes: 'Implement Conv2d -> BatchNorm2d -> ReLU -> MaxPool2d pattern in PyTorch. Verify shape calculations: (W - K + 2P)/S + 1.', completed: false },
  { id: 'prac-pytorch', name: 'PyTorch/TensorFlow Basics', practiceCount: 2, confidence: 60, lastPracticed: 'May 19, 2026', lastPracticedTimestamp: 1779235200000, bugsFaced: 'Gradients not resetting between iterations (forgetting optimizer.zero_grad()).', notes: 'Dataset and DataLoader classes. Custom loops: model(x), loss_fn(y_pred, y), loss.backward(), optimizer.step().', completed: true }
];

const initialMiniTasks: MiniTask[] = [
  { id: 'task-titanic', title: 'Titanic Classification', objective: 'Predict survival using random forests, handling missing ages and ticket details.', datasetInfo: 'Titanic dataset from Kaggle (891 rows, binary target)', estimatedDuration: '2 hours', difficulty: 'Easy', completed: true, githubLink: 'https://github.com/ADITYApg-123/titanic-rf', notes: 'Achieved 82% validation accuracy. Feature engineering of title extracted from Name helped.' },
  { id: 'task-house', title: 'House Price Prediction', objective: 'Predict continuous pricing using regularized regression and XGBoost, fixing skewness.', datasetInfo: 'Ames Housing dataset (79 features, continuous target)', estimatedDuration: '3 hours', difficulty: 'Medium', completed: false, githubLink: '', notes: 'Need to implement log-transformation for target variable because of skewness.' },
  { id: 'task-mnist', title: 'MNIST Classification', objective: 'Build a custom PyTorch CNN to classify handwritten digits with >99% validation accuracy.', datasetInfo: 'MNIST (70k grayscale 28x28 images, 10 classes)', estimatedDuration: '2 hours', difficulty: 'Easy', completed: false, githubLink: '', notes: 'Need to write custom CNN structure with Conv2d layers and Dropout.' },
  { id: 'task-spam', title: 'Spam Detection', objective: 'Use TF-IDF feature vectors and Naive Bayes to classify SMS messages as spam or ham.', datasetInfo: 'SMS Spam Collection (5.5k messages, text)', estimatedDuration: '2.5 hours', difficulty: 'Medium', completed: true, githubLink: 'https://github.com/ADITYApg-123/sms-naive-bayes', notes: 'Naive Bayes is extremely fast and effective for this task. Lemmatization improved accuracy by 1.5%.' },
  { id: 'task-churn', title: 'Customer Churn Prediction', objective: 'Train classification models (XGBoost vs Logistic Regression) and evaluate using ROC-AUC.', datasetInfo: 'Telco Churn Dataset (7k rows, high class imbalance)', estimatedDuration: '4 hours', difficulty: 'Hard', completed: false, githubLink: '', notes: 'Must deal with class imbalance using SMOTE or scale_pos_weight parameter in XGBoost.' }
];

const initialInterviewQuestions: InterviewQuestion[] = [
  { id: 'q-rf-dt', category: 'ML Fundamentals', question: 'Why Random Forest over Decision Tree?', selfRating: 4, answeredConfidently: true, notes: 'Decision Trees have high variance and overfit easily. Random Forests reduce variance by averaging outputs of many independent bootstrap-trained trees (Bagging), using feature subsets (feature bagging) for splits.', bookmarked: false, revisionNeeded: false },
  { id: 'q-overfitting', category: 'ML Fundamentals', question: 'What is overfitting and how do you reduce it?', selfRating: 5, answeredConfidently: true, notes: 'Overfitting is when a model learns noise in training data instead of general patterns. Reductions: Regularization (L1/L2), early stopping, cross-validation, simplifying architecture, dropout (DL), data augmentation.', bookmarked: false, revisionNeeded: false },
  { id: 'q-relu', category: 'DL Fundamentals', question: 'Why ReLU over Sigmoid or Tanh in hidden layers?', selfRating: 2, answeredConfidently: false, notes: 'Sigmoid and Tanh suffer from vanishing gradients because their derivatives are extremely close to 0 for large values. ReLU derivative is constant 1 for positive values, preventing vanishing gradients and speeding up gradient descent convergence.', bookmarked: true, revisionNeeded: true },
  { id: 'q-biasvar', category: 'ML Fundamentals', question: 'Explain bias-variance tradeoff.', selfRating: 5, answeredConfidently: true, notes: 'High bias implies underfitting (oversimplification, low training & testing scores). High variance implies overfitting (complexity, high training score, poor test score). We seek to find the sweet spot that minimizes total error.', bookmarked: false, revisionNeeded: false },
  { id: 'q-pipeline', category: 'Practical ML', question: 'Explain your ML pipeline. How do you prevent data leakage?', selfRating: 3, answeredConfidently: false, notes: 'A proper pipeline splits data *before* any preprocessing (scaling, imputation, encoding). We fit scaling parameters only on the training set, then transform both train and test. Sklearn Pipeline handles this automatically.', bookmarked: true, revisionNeeded: false },
  { id: 'q-dead-relu', category: 'Debugging Questions', question: 'What is the "dying ReLU" problem and how can you fix it?', selfRating: 1, answeredConfidently: false, notes: 'When inputs to ReLU are negative, gradient is 0. If a neuron outputs negative values across the whole dataset, it will never update and dies. Fixes: Use Leaky ReLU, ELU, lower the learning rate, or initialize weights properly (e.g. He initialization).', bookmarked: false, revisionNeeded: true },
  { id: 'q-transformer-attn', category: 'DL Fundamentals', question: 'Explain self-attention in Transformers.', selfRating: 2, answeredConfidently: false, notes: 'Computes relationship between all tokens in a sequence. Query, Key, and Value vectors are generated. Dot product of Query and Key represents raw attention weights. Softmax yields weights. Multiply weights by Value vectors.', bookmarked: true, revisionNeeded: true }
];

const initialDailyGoals: DailyGoal[] = [
  { id: 'goal-1', title: 'Revise Logistic Regression theory & loss math', completed: false, timeSpent: 0, notes: '' },
  { id: 'goal-2', title: 'Implement train/test split from scratch in NumPy', completed: true, timeSpent: 25, notes: 'Did it using index permutation. Shuffling is crucial.' },
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
      name: 'internx50-mldl-prep-v1',
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
