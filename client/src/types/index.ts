export interface User {
  id: number;
  name: string;
  email: string;
  tier: 'free' | 'pro';
}

export interface ReviewFinding {
  title: string;
  description: string;
  severity: string;
  line?: number;
  fix?: string;
  suggestion?: string;
}

export interface ReviewFeedback {
  summary: string;
  score: number;
  language: string;
  bugs: ReviewFinding[];
  performance: ReviewFinding[];
  security: ReviewFinding[];
  improvements: string[];
  correctedCode?: string;
}

export interface ReviewRecord {
  id: number;
  language: string;
  score: number | null;
  code_snippet: string;
  ai_feedback: ReviewFeedback;
  created_at: string;
}
