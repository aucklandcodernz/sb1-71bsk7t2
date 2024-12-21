export interface Recognition {
  id: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  type: 'kudos' | 'achievement' | 'milestone' | 'performance';
  title: string;
  message: string;
  points?: number;
  badges?: string[];
  createdAt: string;
  visibility: 'public' | 'team' | 'private';
  reactions: {
    employeeId: string;
    type: string;
  }[];
  comments: {
    id: string;
    employeeId: string;
    message: string;
    createdAt: string;
  }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  points: number;
}

export interface EmployeeAchievement {
  employeeId: string;
  badges: string[];
  totalPoints: number;
  recognitionsReceived: number;
  recognitionsGiven: number;
  lastRecognition: string;
}