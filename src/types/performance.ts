import { Employee } from './index';

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewDate: string;
  dueDate: string;
  status: 'draft' | 'pending' | 'completed';
  type: 'probation' | 'quarterly' | 'annual';
  ratings: {
    [key: string]: number; // 1-5 scale
  };
  competencies: {
    technical: CompetencyRating[];
    soft: CompetencyRating[];
    leadership?: CompetencyRating[];
  };
  goals: {
    previous: Goal[];
    current: Goal[];
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    comments: string;
  };
  development: {
    trainingNeeds: string[];
    careerPath: string;
    actionItems: string[];
  };
  acknowledgment?: {
    employeeSignature?: string;
    employeeDate?: string;
    reviewerSignature?: string;
    reviewerDate?: string;
  };
}

export interface CompetencyRating {
  name: string;
  rating: number;
  comments: string;
}

export interface Goal {
  id: string;
  description: string;
  targetDate: string;
  status: 'not_started' | 'in_progress' | 'completed';
  measures: string[];
  achievements?: string[];
}

export interface PerformanceMetrics {
  attendance: number;
  productivity: number;
  quality: number;
  teamwork: number;
  initiative: number;
  leadership?: number;
}

export interface ReviewTemplate {
  id: string;
  name: string;
  type: PerformanceReview['type'];
  sections: {
    competencies: {
      technical: string[];
      soft: string[];
      leadership?: string[];
    };
    metrics: (keyof PerformanceMetrics)[];
    questions: {
      id: string;
      text: string;
      type: 'rating' | 'text' | 'goals';
      required: boolean;
    }[];
  };
}