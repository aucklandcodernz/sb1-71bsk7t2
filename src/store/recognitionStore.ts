import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recognition, Badge, EmployeeAchievement } from '../types/recognition';
import { v4 as uuidv4 } from 'uuid';

interface RecognitionStore {
  recognitions: Recognition[];
  badges: Badge[];
  achievements: EmployeeAchievement[];
  
  addRecognition: (recognition: Omit<Recognition, 'id' | 'createdAt' | 'reactions' | 'comments'>) => void;
  addReaction: (recognitionId: string, employeeId: string, type: string) => void;
  addComment: (recognitionId: string, employeeId: string, message: string) => void;
  getEmployeeRecognitions: (employeeId: string) => Recognition[];
  getEmployeeAchievements: (employeeId: string) => EmployeeAchievement;
  getTeamRecognitions: (teamId: string) => Recognition[];
}

export const useRecognitionStore = create<RecognitionStore>()(
  persist(
    (set, get) => ({
      recognitions: [],
      badges: [
        {
          id: 'team-player',
          name: 'Team Player',
          description: 'Outstanding contribution to team success',
          icon: '🤝',
          criteria: 'Receive 5 team-related recognitions',
          points: 100
        },
        {
          id: 'innovator',
          name: 'Innovator',
          description: 'Bringing creative solutions to challenges',
          icon: '💡',
          criteria: 'Implement 3 innovative solutions',
          points: 150
        },
        {
          id: 'mentor',
          name: 'Mentor',
          description: 'Helping others grow and succeed',
          icon: '🌟',
          criteria: 'Mentor 3 team members',
          points: 200
        }
      ],
      achievements: [],

      addRecognition: (recognition) => {
        const newRecognition: Recognition = {
          ...recognition,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          reactions: [],
          comments: []
        };

        set((state) => ({
          recognitions: [newRecognition, ...state.recognitions]
        }));

        // Update achievements
        const achievements = get().achievements;
        const recipientAchievement = achievements.find(
          a => a.employeeId === recognition.toEmployeeId
        );

        if (recipientAchievement) {
          set((state) => ({
            achievements: state.achievements.map(a =>
              a.employeeId === recognition.toEmployeeId
                ? {
                    ...a,
                    recognitionsReceived: a.recognitionsReceived + 1,
                    lastRecognition: new Date().toISOString()
                  }
                : a
            )
          }));
        } else {
          set((state) => ({
            achievements: [
              ...state.achievements,
              {
                employeeId: recognition.toEmployeeId,
                badges: [],
                totalPoints: 0,
                recognitionsReceived: 1,
                recognitionsGiven: 0,
                lastRecognition: new Date().toISOString()
              }
            ]
          }));
        }
      },

      addReaction: (recognitionId, employeeId, type) => {
        set((state) => ({
          recognitions: state.recognitions.map((recognition) =>
            recognition.id === recognitionId
              ? {
                  ...recognition,
                  reactions: [
                    ...recognition.reactions,
                    { employeeId, type }
                  ]
                }
              : recognition
          )
        }));
      },

      addComment: (recognitionId, employeeId, message) => {
        set((state) => ({
          recognitions: state.recognitions.map((recognition) =>
            recognition.id === recognitionId
              ? {
                  ...recognition,
                  comments: [
                    ...recognition.comments,
                    {
                      id: uuidv4(),
                      employeeId,
                      message,
                      createdAt: new Date().toISOString()
                    }
                  ]
                }
              : recognition
          )
        }));
      },

      getEmployeeRecognitions: (employeeId) => {
        return get().recognitions.filter(
          r => r.toEmployeeId === employeeId || r.fromEmployeeId === employeeId
        );
      },

      getEmployeeAchievements: (employeeId) => {
        return (
          get().achievements.find(a => a.employeeId === employeeId) || {
            employeeId,
            badges: [],
            totalPoints: 0,
            recognitionsReceived: 0,
            recognitionsGiven: 0,
            lastRecognition: ''
          }
        );
      },

      getTeamRecognitions: (teamId) => {
        return get().recognitions.filter(
          r => r.visibility === 'public' || r.visibility === 'team'
        );
      }
    }),
    {
      name: 'recognition-storage'
    }
  )
);