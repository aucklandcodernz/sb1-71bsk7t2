import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, isAfter, isBefore, parseISO } from 'date-fns';
import ical from 'ical-generator';

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
  type: 'critical' | 'important' | 'routine';
  assignee: string;
  documentIds: string[];
  reminderDays: number[];
}

interface ComplianceStore {
  items: ComplianceItem[];
  addItem: (item: Omit<ComplianceItem, 'id'>) => void;
  updateStatus: (id: string, status: ComplianceItem['status']) => void;
  attachDocument: (id: string, documentId: string) => void;
  removeDocument: (id: string, documentId: string) => void;
  getUpcomingDeadlines: () => ComplianceItem[];
  generateCalendar: () => string;
  getStats: () => {
    completed: number;
    inProgress: number;
    overdue: number;
    upcoming: number;
  };
}

export const useComplianceStore = create<ComplianceStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          items: [...state.items, { ...item, id, documentIds: [] }],
        }));
      },
      
      updateStatus: (id, status) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, status } : item
          ),
        })),
      
      attachDocument: (id, documentId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, documentIds: [...item.documentIds, documentId] }
              : item
          ),
        })),
      
      removeDocument: (id, documentId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  documentIds: item.documentIds.filter((docId) => docId !== documentId),
                }
              : item
          ),
        })),
      
      getUpcomingDeadlines: () => {
        const now = new Date();
        const thirtyDaysFromNow = addDays(now, 30);
        return get().items.filter(
          (item) =>
            item.status !== 'completed' &&
            isAfter(parseISO(item.deadline), now) &&
            isBefore(parseISO(item.deadline), thirtyDaysFromNow)
        );
      },
      
      generateCalendar: () => {
        const cal = ical({ name: 'Compliance Calendar' });
        
        get().items.forEach((item) => {
          cal.createEvent({
            start: parseISO(item.deadline),
            end: parseISO(item.deadline),
            summary: item.title,
            description: item.description,
            location: 'KiwiHR System',
            url: `https://app.kiwihr.com/compliance/${item.id}`,
          });
        });
        
        return cal.toString();
      },
      
      getStats: () => {
        const items = get().items;
        const now = new Date();
        const thirtyDaysFromNow = addDays(now, 30);

        return {
          completed: items.filter((item) => item.status === 'completed').length,
          inProgress: items.filter((item) => item.status === 'in_progress').length,
          overdue: items.filter(
            (item) =>
              item.status !== 'completed' &&
              isBefore(parseISO(item.deadline), now)
          ).length,
          upcoming: items.filter(
            (item) =>
              item.status !== 'completed' &&
              isAfter(parseISO(item.deadline), now) &&
              isBefore(parseISO(item.deadline), thirtyDaysFromNow)
          ).length,
        };
      },
    }),
    {
      name: 'compliance-storage',
    }
  )
);