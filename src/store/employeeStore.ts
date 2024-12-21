import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Employee } from '../types';

// Initial test data with diverse employees and payroll scenarios
const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@kiwihr.co.nz',
    position: 'Senior Developer',
    department: 'Engineering',
    startDate: '2024-01-15',
    status: 'active',
    salary: '95000',
    phoneNumber: '+64 21 123 4567',
    emergencyContact: 'Jane Smith - +64 21 987 6543',
    address: '123 Queen Street, Auckland',
    taxCode: 'M',
    kiwiSaverRate: '3',
    bankAccount: '12-3456-7890123-00',
    irdNumber: '123456789'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@kiwihr.co.nz',
    position: 'HR Manager',
    department: 'Human Resources',
    startDate: '2024-02-01',
    status: 'active',
    salary: '85000',
    phoneNumber: '+64 21 234 5678',
    emergencyContact: 'Mike Wilson - +64 21 876 5432',
    address: '456 Victoria Street, Wellington',
    taxCode: 'M',
    kiwiSaverRate: '4',
    bankAccount: '12-3456-7890456-00',
    irdNumber: '987654321'
  },
  {
    id: '3',
    name: 'David Lee',
    email: 'david.lee@kiwihr.co.nz',
    position: 'Marketing Specialist',
    department: 'Marketing',
    startDate: '2024-02-15',
    status: 'on_leave',
    salary: '75000',
    phoneNumber: '+64 21 345 6789',
    emergencyContact: 'Mary Lee - +64 21 765 4321',
    address: '789 Lambton Quay, Wellington',
    taxCode: 'M SL',
    kiwiSaverRate: '6',
    bankAccount: '12-3456-7890789-00',
    irdNumber: '456789123'
  },
  {
    id: '4',
    name: 'Emma Brown',
    email: 'emma.brown@kiwihr.co.nz',
    position: 'Financial Analyst',
    department: 'Finance',
    startDate: '2024-03-01',
    status: 'active',
    salary: '82000',
    phoneNumber: '+64 21 456 7890',
    emergencyContact: 'James Brown - +64 21 654 3210',
    address: '321 High Street, Christchurch',
    taxCode: 'M',
    kiwiSaverRate: '8',
    bankAccount: '12-3456-7891234-00',
    irdNumber: '789123456'
  },
  {
    id: '5',
    name: 'Michael Chen',
    email: 'michael.chen@kiwihr.co.nz',
    position: 'Sales Manager',
    department: 'Sales',
    startDate: '2024-03-15',
    status: 'active',
    salary: '110000',
    phoneNumber: '+64 21 567 8901',
    emergencyContact: 'Linda Chen - +64 21 543 2109',
    address: '654 Dominion Road, Auckland',
    taxCode: 'M',
    kiwiSaverRate: '3',
    bankAccount: '12-3456-7891567-00',
    irdNumber: '321654987'
  },
  {
    id: '6',
    name: 'Sophie Taylor',
    email: 'sophie.taylor@kiwihr.co.nz',
    position: 'Customer Success Manager',
    department: 'Customer Support',
    startDate: '2024-01-10',
    status: 'active',
    salary: '78000',
    phoneNumber: '+64 21 678 9012',
    emergencyContact: 'Tom Taylor - +64 21 432 1098',
    address: '987 Cuba Street, Wellington',
    taxCode: 'M',
    kiwiSaverRate: '4',
    bankAccount: '12-3456-7891890-00',
    irdNumber: '654987321'
  },
  {
    id: '7',
    name: 'William Parker',
    email: 'william.parker@kiwihr.co.nz',
    position: 'IT Support Specialist',
    department: 'Engineering',
    startDate: '2024-02-20',
    status: 'active',
    salary: '72000',
    phoneNumber: '+64 21 789 0123',
    emergencyContact: 'Emily Parker - +64 21 321 0987',
    address: '246 Manchester Street, Christchurch',
    taxCode: 'M SL',
    kiwiSaverRate: '3',
    bankAccount: '12-3456-7892123-00',
    irdNumber: '987321654'
  },
  {
    id: '8',
    name: 'Olivia Singh',
    email: 'olivia.singh@kiwihr.co.nz',
    position: 'Product Manager',
    department: 'Product',
    startDate: '2024-01-05',
    status: 'active',
    salary: '98000',
    phoneNumber: '+64 21 890 1234',
    emergencyContact: 'Raj Singh - +64 21 210 9876',
    address: '135 Ponsonby Road, Auckland',
    taxCode: 'M',
    kiwiSaverRate: '6',
    bankAccount: '12-3456-7892456-00',
    irdNumber: '654321987'
  },
  {
    id: '9',
    name: 'James Wilson',
    email: 'james.wilson@kiwihr.co.nz',
    position: 'Operations Manager',
    department: 'Operations',
    startDate: '2024-02-05',
    status: 'active',
    salary: '92000',
    phoneNumber: '+64 21 901 2345',
    emergencyContact: 'Kate Wilson - +64 21 109 8765',
    address: '753 Willis Street, Wellington',
    taxCode: 'M',
    kiwiSaverRate: '4',
    bankAccount: '12-3456-7892789-00',
    irdNumber: '321987654'
  },
  {
    id: '10',
    name: 'Lucy Zhang',
    email: 'lucy.zhang@kiwihr.co.nz',
    position: 'UX Designer',
    department: 'Design',
    startDate: '2024-03-10',
    status: 'active',
    salary: '88000',
    phoneNumber: '+64 21 012 3456',
    emergencyContact: 'Wei Zhang - +64 21 098 7654',
    address: '864 Karangahape Road, Auckland',
    taxCode: 'M',
    kiwiSaverRate: '8',
    bankAccount: '12-3456-7893012-00',
    irdNumber: '789654321'
  },
  {
    id: '11',
    name: 'Thomas Anderson',
    email: 'thomas.anderson@kiwihr.co.nz',
    position: 'Software Engineer',
    department: 'Engineering',
    startDate: '2024-01-20',
    status: 'active',
    salary: '90000',
    phoneNumber: '+64 21 123 7890',
    emergencyContact: 'Sarah Anderson - +64 21 987 1234',
    address: '42 Cuba Street, Wellington',
    taxCode: 'M SL',
    kiwiSaverRate: '4',
    bankAccount: '12-3456-7893345-00',
    irdNumber: '456123789'
  },
  {
    id: '12',
    name: 'Isabella Martinez',
    email: 'isabella.martinez@kiwihr.co.nz',
    position: 'Marketing Manager',
    department: 'Marketing',
    startDate: '2024-02-10',
    status: 'active',
    salary: '95000',
    phoneNumber: '+64 21 234 8901',
    emergencyContact: 'Carlos Martinez - +64 21 876 2345',
    address: '789 Courtenay Place, Wellington',
    taxCode: 'M',
    kiwiSaverRate: '6',
    bankAccount: '12-3456-7893678-00',
    irdNumber: '789456123'
  },
  {
    id: '13',
    name: 'Oliver White',
    email: 'oliver.white@kiwihr.co.nz',
    position: 'Sales Representative',
    department: 'Sales',
    startDate: '2024-03-05',
    status: 'active',
    salary: '70000',
    phoneNumber: '+64 21 345 9012',
    emergencyContact: 'Emma White - +64 21 765 3456',
    address: '321 Lambton Quay, Wellington',
    taxCode: 'M',
    kiwiSaverRate: '3',
    bankAccount: '12-3456-7893901-00',
    irdNumber: '123789456'
  },
  {
    id: '14',
    name: 'Sophia Patel',
    email: 'sophia.patel@kiwihr.co.nz',
    position: 'HR Coordinator',
    department: 'Human Resources',
    startDate: '2024-02-25',
    status: 'active',
    salary: '65000',
    phoneNumber: '+64 21 456 0123',
    emergencyContact: 'Raj Patel - +64 21 654 4567',
    address: '456 Dixon Street, Wellington',
    taxCode: 'M SL',
    kiwiSaverRate: '4',
    bankAccount: '12-3456-7894234-00',
    irdNumber: '456789123'
  },
  {
    id: '15',
    name: 'Ethan Williams',
    email: 'ethan.williams@kiwihr.co.nz',
    position: 'Customer Support Specialist',
    department: 'Customer Support',
    startDate: '2024-01-15',
    status: 'active',
    salary: '68000',
    phoneNumber: '+64 21 567 1234',
    emergencyContact: 'Lisa Williams - +64 21 543 5678',
    address: '987 Manners Street, Wellington',
    taxCode: 'M',
    kiwiSaverRate: '8',
    bankAccount: '12-3456-7894567-00',
    irdNumber: '987123456'
  }
];

interface EmployeeStore {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  getEmployeesByDepartment: (department: string) => Employee[];
  getActiveEmployees: () => Employee[];
  getEmployeesOnLeave: () => Employee[];
}

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: INITIAL_EMPLOYEES,
      
      addEmployee: (employee) =>
        set((state) => ({ employees: [...state.employees, employee] })),
      
      updateEmployee: (id, employee) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...employee } : emp
          ),
        })),
      
      removeEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        })),
      
      getEmployeeById: (id) => get().employees.find((emp) => emp.id === id),
      
      getEmployeesByDepartment: (department) =>
        get().employees.filter((emp) => emp.department === department),
      
      getActiveEmployees: () =>
        get().employees.filter((emp) => emp.status === 'active'),
      
      getEmployeesOnLeave: () =>
        get().employees.filter((emp) => emp.status === 'on_leave'),
    }),
    {
      name: 'employee-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            employees: persistedState.employees || INITIAL_EMPLOYEES,
          };
        }
        return persistedState;
      },
    }
  )
);