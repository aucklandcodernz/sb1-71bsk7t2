import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Initial dummy data for enrolled courses
const INITIAL_ENROLLED_COURSES = [
  {
    id: '4',
    title: 'Workplace Communication',
    description: 'Master effective workplace communication skills',
    duration: '2.5 hours',
    level: 'intermediate',
    progress: 75,
    currentModuleId: 'm2',
    completedModuleIds: ['m1'],
    lastAccessed: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Active Listening',
        content: 'Learn the principles of active listening.',
        duration: '45 minutes',
      },
      {
        id: 'm2',
        title: 'Clear Communication',
        content: 'Techniques for clear and effective communication.',
        duration: '45 minutes',
      },
      {
        id: 'm3',
        title: 'Conflict Resolution',
        content: 'Managing and resolving workplace conflicts.',
        duration: '60 minutes',
      }
    ],
    requirements: ['Basic English proficiency'],
    objectives: ['Improve communication skills', 'Handle conflicts better']
  }
];

// Initial dummy data for available courses
const INITIAL_COURSES = [
  {
    id: '1',
    title: 'Health & Safety Fundamentals',
    description: 'Essential workplace safety training for all employees',
    duration: '2 hours',
    level: 'beginner',
    enrollmentCount: 45,
    rating: 4.8,
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Workplace Safety',
        content: 'Learn the basics of workplace safety and hazard identification.',
        duration: '30 minutes',
        resources: [
          {
            id: 'r1',
            name: 'Safety Guidelines PDF',
            type: 'PDF',
            url: 'https://example.com/safety-guidelines.pdf'
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'What is the first step in hazard identification?',
            options: [
              'Ignore the hazard',
              'Report to supervisor',
              'Assess the situation',
              'Start running'
            ],
            correctAnswer: 2
          }
        ]
      },
      {
        id: 'm2',
        title: 'Emergency Procedures',
        content: 'Understanding emergency protocols and evacuation procedures.',
        duration: '45 minutes'
      }
    ],
    requirements: ['No prerequisites required'],
    objectives: ['Understand basic safety principles', 'Learn emergency procedures']
  },
  {
    id: '2',
    title: 'Leadership Skills for Managers',
    description: 'Develop essential leadership skills for effective team management',
    duration: '4 hours',
    level: 'intermediate',
    enrollmentCount: 32,
    rating: 4.6,
    modules: [
      {
        id: 'm3',
        title: 'Effective Communication',
        content: 'Master the art of clear and effective communication.',
        duration: '1 hour'
      }
    ],
    requirements: ['Minimum 1 year management experience'],
    objectives: ['Improve team communication', 'Develop leadership style']
  },
  {
    id: '3',
    title: 'Time Management Essentials',
    description: 'Learn to manage your time effectively and boost productivity',
    duration: '3 hours',
    level: 'beginner',
    enrollmentCount: 28,
    rating: 4.5,
    modules: [
      {
        id: 'm4',
        title: 'Priority Setting',
        content: 'Learn how to set and manage priorities effectively.',
        duration: '45 minutes'
      }
    ],
    requirements: ['No prerequisites required'],
    objectives: ['Learn prioritization techniques', 'Improve productivity']
  }
];

interface TrainingStore {
  courses: Course[];
  enrolledCourses: EnrolledCourse[];
  addCourse: (course: Omit<Course, 'id' | 'enrollmentCount' | 'rating'>) => void;
  enrollInCourse: (courseId: string) => void;
  updateProgress: (courseId: string, moduleId: string) => void;
  getCourseStats: () => {
    totalCourses: number;
    totalEnrollments: number;
    completionRate: number;
    averageRating: number;
  };
  getPopularCourses: () => Course[];
  getRecommendedCourses: () => Course[];
}

export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set, get) => ({
      courses: INITIAL_COURSES,
      enrolledCourses: INITIAL_ENROLLED_COURSES,

      addCourse: (courseData) => {
        const id = uuidv4();
        const course: Course = {
          ...courseData,
          id,
          enrollmentCount: 0,
          rating: 0,
          modules: courseData.modules.map(module => ({
            ...module,
            id: uuidv4()
          }))
        };
        set((state) => ({
          courses: [...state.courses, course],
        }));
      },

      enrollInCourse: (courseId) => {
        const course = get().courses.find((c) => c.id === courseId);
        if (!course) return;

        // Check if already enrolled
        if (get().enrolledCourses.some(c => c.id === courseId)) return;

        const enrolledCourse: EnrolledCourse = {
          ...course,
          progress: 0,
          completed: false,
          currentModuleId: course.modules[0]?.id || '',
          completedModuleIds: [],
          lastAccessed: new Date().toISOString(),
        };

        set((state) => ({
          enrolledCourses: [...state.enrolledCourses, enrolledCourse],
          courses: state.courses.map((c) =>
            c.id === courseId
              ? { ...c, enrollmentCount: c.enrollmentCount + 1 }
              : c
          ),
        }));
      },

      updateProgress: (courseId: string, moduleId: string) => {
        set((state) => {
          const courseIndex = state.enrolledCourses.findIndex((c) => c.id === courseId);
          if (courseIndex === -1) return state;

          const course = state.enrolledCourses[courseIndex];
          const newCompletedModuleIds = Array.from(
            new Set([...(course.completedModuleIds || []), moduleId])
          );

          const progress = Math.round(
            (newCompletedModuleIds.length / course.modules.length) * 100
          );

          const moduleIndex = course.modules.findIndex((m) => m.id === moduleId);
          const nextModuleId = moduleIndex < course.modules.length - 1
            ? course.modules[moduleIndex + 1].id
            : moduleId;

          const updatedCourse: EnrolledCourse = {
            ...course,
            completedModuleIds: newCompletedModuleIds,
            progress,
            completed: progress === 100,
            currentModuleId: nextModuleId,
            lastAccessed: new Date().toISOString(),
          };

          const newEnrolledCourses = [...state.enrolledCourses];
          newEnrolledCourses[courseIndex] = updatedCourse;

          return {
            ...state,
            enrolledCourses: newEnrolledCourses,
          };
        });
      },

      getCourseStats: () => {
        const { courses, enrolledCourses } = get();
        const completedCourses = enrolledCourses.filter((c) => c.completed);

        return {
          totalCourses: courses.length,
          totalEnrollments: enrolledCourses.length,
          completionRate:
            enrolledCourses.length > 0
              ? (completedCourses.length / enrolledCourses.length) * 100
              : 0,
          averageRating:
            courses.reduce((sum, course) => sum + course.rating, 0) /
              courses.length || 0,
        };
      },

      getPopularCourses: () => {
        return [...get().courses]
          .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
          .slice(0, 3);
      },

      getRecommendedCourses: () => {
        const enrolledCourseIds = get().enrolledCourses.map((c) => c.id);
        return get().courses
          .filter((course) => !enrolledCourseIds.includes(course.id))
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
      },
    }),
    {
      name: 'training-storage',
    }
  )
);