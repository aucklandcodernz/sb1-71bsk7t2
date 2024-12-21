import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Expense, ExpenseCategory } from '../types/expense';
import { v4 as uuidv4 } from 'uuid';

// Initial dummy data for testing
const INITIAL_EXPENSES: Expense[] = [
  {
    id: '1',
    employeeId: 'emp1',
    date: '2024-03-15',
    category: 'travel',
    amount: 250.50,
    description: 'Flight to Wellington for client meeting',
    status: 'approved',
    approvedBy: 'manager1',
    approvedDate: '2024-03-16',
  },
  {
    id: '2',
    employeeId: 'emp2',
    date: '2024-03-14',
    category: 'meals',
    amount: 45.00,
    description: 'Team lunch meeting',
    status: 'pending',
  },
  {
    id: '3',
    employeeId: 'emp1',
    date: '2024-03-13',
    category: 'accommodation',
    amount: 180.00,
    description: 'Hotel stay in Auckland',
    status: 'pending',
  },
];

const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  {
    id: 'travel',
    name: 'Travel',
    description: 'Transportation costs including mileage',
    requiresReceipt: true,
    requiresApproval: true,
  },
  {
    id: 'meals',
    name: 'Meals & Entertainment',
    description: 'Business meals and client entertainment',
    limit: 100,
    requiresReceipt: true,
    requiresApproval: true,
  },
  {
    id: 'accommodation',
    name: 'Accommodation',
    description: 'Hotel and lodging expenses',
    requiresReceipt: true,
    requiresApproval: true,
  },
  {
    id: 'supplies',
    name: 'Office Supplies',
    description: 'General office supplies and equipment',
    requiresReceipt: true,
    requiresApproval: false,
  },
];

interface ExpenseStore {
  expenses: Expense[];
  categories: ExpenseCategory[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  approveExpense: (id: string, approverId: string) => void;
  rejectExpense: (id: string, note: string) => void;
  addCategory: (category: Omit<ExpenseCategory, 'id'>) => void;
  updateCategory: (id: string, category: Partial<ExpenseCategory>) => void;
  deleteCategory: (id: string) => void;
  getEmployeeExpenses: (employeeId: string) => Expense[];
  getExpenseStats: () => {
    totalPending: number;
    totalApproved: number;
    totalAmount: number;
    byCategory: Record<string, number>;
  };
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: INITIAL_EXPENSES,
      categories: DEFAULT_CATEGORIES,
      
      addExpense: (expense) => {
        const id = uuidv4();
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id }],
        }));
      },
      
      updateExpense: (id, expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...expense } : e
          ),
        })),
      
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      
      approveExpense: (id, approverId) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status: 'approved',
                  approvedBy: approverId,
                  approvedDate: new Date().toISOString(),
                }
              : e
          ),
        })),
      
      rejectExpense: (id, note) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status: 'rejected',
                  notes: note,
                }
              : e
          ),
        })),
      
      addCategory: (category) => {
        const id = uuidv4();
        set((state) => ({
          categories: [...state.categories, { ...category, id }],
        }));
      },
      
      updateCategory: (id, category) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...category } : c
          ),
        })),
      
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
      
      getEmployeeExpenses: (employeeId) => {
        return get().expenses.filter((e) => e.employeeId === employeeId);
      },
      
      getExpenseStats: () => {
        const expenses = get().expenses;
        const pending = expenses.filter((e) => e.status === 'pending');
        const approved = expenses.filter((e) => e.status === 'approved');
        
        const byCategory = expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {} as Record<string, number>);
        
        return {
          totalPending: pending.length,
          totalApproved: approved.length,
          totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
          byCategory,
        };
      },
    }),
    {
      name: 'expense-storage',
    }
  )
);