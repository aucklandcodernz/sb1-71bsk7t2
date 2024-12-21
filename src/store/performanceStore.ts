import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PerformanceReview, ReviewTemplate } from '../types/performance';
import { v4 as uuidv4 } from 'uuid';
import { addMonths, format } from 'date-fns';

// Initial test data for reviews
const INITIAL_REVIEWS: PerformanceReview[] = [
  {
    id: '1',
    employeeId: '1',
    reviewerId: 'admin',
    reviewDate: '2024-03-01',
    dueDate: '2024-03-15',
    status: 'completed',
    type: 'annual',
    ratings: {
      technical: 4.5,
      communication: 4.0,
      initiative: 3.8,
      teamwork: 4.2,
      leadership: 3.9,
      quality: 4.3,
    },
    competencies: {
      technical: [
        { name: 'Job Knowledge', rating: 4, comments: 'Strong technical expertise' },
        { name: 'Problem Solving', rating: 5, comments: 'Excellent analytical skills' },
      ],
      soft: [
        { name: 'Communication', rating: 4, comments: 'Clear and effective communicator' },
        { name: 'Teamwork', rating: 4, comments: 'Works well in team settings' },
      ],
      leadership: [
        { name: 'Decision Making', rating: 4, comments: 'Makes sound decisions' },
        { name: 'Team Management', rating: 3, comments: 'Growing leadership skills' },
      ],
    },
    goals: {
      previous: [
        {
          id: 'g1',
          description: 'Complete advanced certification',
          status: 'completed',
          targetDate: '2023-12-31',
          measures: ['Certification obtained'],
          achievements: ['Passed with distinction'],
        },
      ],
      current: [
        {
          id: 'g2',
          description: 'Lead major project implementation',
          status: 'in_progress',
          targetDate: '2024-06-30',
          measures: ['Project delivered on time', 'Within budget', 'Client satisfaction'],
        },
      ],
    },
    feedback: {
      strengths: [
        'Strong technical skills',
        'Excellent problem solver',
        'Good team player',
      ],
      improvements: [
        'Could delegate more effectively',
        'Public speaking skills',
      ],
      comments: 'Overall strong performer with good potential for growth.',
    },
    development: {
      trainingNeeds: [
        'Advanced leadership training',
        'Public speaking workshop',
      ],
      careerPath: 'Technical Lead → Engineering Manager',
      actionItems: [
        'Enroll in leadership training program',
        'Take on more team lead responsibilities',
      ],
    },
  },
  {
    id: '2',
    employeeId: '2',
    reviewerId: 'admin',
    reviewDate: '2024-02-15',
    dueDate: '2024-02-28',
    status: 'completed',
    type: 'quarterly',
    ratings: {
      technical: 4.2,
      communication: 4.5,
      initiative: 4.0,
      teamwork: 4.3,
      leadership: 4.1,
      quality: 4.0,
    },
    competencies: {
      technical: [
        { name: 'Job Knowledge', rating: 4, comments: 'Good domain knowledge' },
        { name: 'Technical Skills', rating: 4, comments: 'Strong technical foundation' },
      ],
      soft: [
        { name: 'Communication', rating: 5, comments: 'Excellent communicator' },
        { name: 'Teamwork', rating: 4, comments: 'Collaborative team member' },
      ],
    },
    goals: {
      previous: [
        {
          id: 'g3',
          description: 'Improve team collaboration',
          status: 'completed',
          targetDate: '2023-12-31',
          measures: ['Team feedback', 'Project completion rates'],
          achievements: ['Implemented new collaboration tools', 'Improved team efficiency'],
        },
      ],
      current: [
        {
          id: 'g4',
          description: 'Develop mentoring program',
          status: 'in_progress',
          targetDate: '2024-06-30',
          measures: ['Program documentation', 'Participant feedback'],
        },
      ],
    },
    feedback: {
      strengths: [
        'Excellent communication skills',
        'Strong leadership potential',
        'Good project management',
      ],
      improvements: [
        'Technical documentation',
        'Time management',
      ],
      comments: 'Consistently performs well and shows great potential.',
    },
    development: {
      trainingNeeds: [
        'Project management certification',
        'Advanced technical training',
      ],
      careerPath: 'Senior Manager → Director',
      actionItems: [
        'Complete PMP certification',
        'Lead cross-functional project',
      ],
    },
  },
];

// Initial test data for review templates
const DEFAULT_TEMPLATES: ReviewTemplate[] = [
  {
    id: '1',
    name: 'Annual Performance Review',
    type: 'annual',
    sections: {
      competencies: {
        technical: [
          'Job Knowledge',
          'Technical Skills',
          'Problem Solving',
          'Quality of Work',
          'Productivity',
        ],
        soft: [
          'Communication',
          'Teamwork',
          'Initiative',
          'Adaptability',
          'Time Management',
        ],
        leadership: [
          'Team Management',
          'Decision Making',
          'Strategic Planning',
          'Mentoring',
          'Change Management',
        ],
      },
      metrics: [
        'attendance',
        'productivity',
        'quality',
        'teamwork',
        'initiative',
        'leadership',
      ],
      questions: [
        {
          id: 'q1',
          text: 'What were your key achievements this year?',
          type: 'text',
          required: true,
        },
        {
          id: 'q2',
          text: 'What are your goals for the next year?',
          type: 'goals',
          required: true,
        },
      ],
    },
  },
  {
    id: '2',
    name: 'Quarterly Review',
    type: 'quarterly',
    sections: {
      competencies: {
        technical: [
          'Job Knowledge',
          'Technical Skills',
          'Problem Solving',
        ],
        soft: [
          'Communication',
          'Teamwork',
          'Initiative',
        ],
      },
      metrics: [
        'productivity',
        'quality',
        'teamwork',
      ],
      questions: [
        {
          id: 'q1',
          text: 'Progress on current goals',
          type: 'text',
          required: true,
        },
      ],
    },
  },
];

interface PerformanceStore {
  reviews: PerformanceReview[];
  templates: ReviewTemplate[];
  
  addReview: (review: Omit<PerformanceReview, 'id'>) => void;
  updateReview: (id: string, review: Partial<PerformanceReview>) => void;
  deleteReview: (id: string) => void;
  
  getEmployeeReviews: (employeeId: string) => PerformanceReview[];
  getPerformanceStats: (employeeId: string) => {
    averageRating: number;
    completedReviews: number;
    nextReviewDate: string | null;
    strengths: string[];
    improvementAreas: string[];
  };
}

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    (set, get) => ({
      reviews: INITIAL_REVIEWS,
      templates: DEFAULT_TEMPLATES,
      
      addReview: (review) => {
        const id = uuidv4();
        set((state) => ({
          reviews: [{ ...review, id }, ...state.reviews],
        }));
      },
      
      updateReview: (id, updates) =>
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === id ? { ...review, ...updates } : review
          ),
        })),
      
      deleteReview: (id) =>
        set((state) => ({
          reviews: state.reviews.filter((review) => review.id !== id),
        })),
      
      getEmployeeReviews: (employeeId) => {
        return get().reviews
          .filter((review) => review.employeeId === employeeId)
          .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
      },
      
      getPerformanceStats: (employeeId) => {
        const reviews = get().getEmployeeReviews(employeeId);
        const completedReviews = reviews.filter((r) => r.status === 'completed');
        
        // Calculate average rating
        const averageRating = completedReviews.length
          ? completedReviews.reduce((sum, review) => {
              const ratings = Object.values(review.ratings);
              return sum + ratings.reduce((a, b) => a + b, 0) / ratings.length;
            }, 0) / completedReviews.length
          : 0;

        // Get next review date
        const lastReview = reviews[0];
        const nextReviewDate = lastReview
          ? format(
              addMonths(
                new Date(lastReview.reviewDate),
                lastReview.type === 'annual' ? 12 : 3
              ),
              'yyyy-MM-dd'
            )
          : null;

        // Collect strengths and improvements
        const strengths = new Set<string>();
        const improvementAreas = new Set<string>();

        completedReviews.forEach((review) => {
          review.feedback.strengths.forEach((s) => strengths.add(s));
          review.feedback.improvements.forEach((i) => improvementAreas.add(i));
        });

        return {
          averageRating,
          completedReviews: completedReviews.length,
          nextReviewDate,
          strengths: Array.from(strengths),
          improvementAreas: Array.from(improvementAreas),
        };
      },
    }),
    {
      name: 'performance-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            reviews: persistedState.reviews || INITIAL_REVIEWS,
            templates: persistedState.templates || DEFAULT_TEMPLATES,
          };
        }
        return persistedState;
      },
    }
  )
);