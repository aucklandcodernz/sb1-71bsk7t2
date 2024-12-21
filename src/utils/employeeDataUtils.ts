import { Employee } from '../types';
import * as XLSX from 'xlsx';
import { validateIRDNumber, validateBankAccount } from './payrollUtils';
import { format } from 'date-fns';

// Test data template
export const TEST_EMPLOYEES = [
  {
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
  }
];

// Validate employee data
export const validateEmployee = (employee: Partial<Employee>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields
  if (!employee.name?.trim()) errors.push('Name is required');
  if (!employee.email?.trim()) errors.push('Email is required');
  if (!employee.position?.trim()) errors.push('Position is required');
  if (!employee.department?.trim()) errors.push('Department is required');
  if (!employee.startDate?.trim()) errors.push('Start date is required');

  // Email format
  if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
    errors.push('Invalid email format');
  }

  // Phone number format (if provided)
  if (employee.phoneNumber && !/^\+?[\d\s-]{8,}$/.test(employee.phoneNumber)) {
    errors.push('Invalid phone number format');
  }

  // Bank account validation (if provided)
  if (employee.bankAccount && !validateBankAccount(employee.bankAccount)) {
    errors.push('Invalid bank account format (XX-XXXX-XXXXXXX-XX)');
  }

  // IRD number validation (if provided)
  if (employee.irdNumber && !validateIRDNumber(employee.irdNumber)) {
    errors.push('Invalid IRD number format (8-9 digits)');
  }

  // KiwiSaver rate validation (if provided)
  if (employee.kiwiSaverRate) {
    const rate = parseFloat(employee.kiwiSaverRate);
    if (isNaN(rate) || ![3, 4, 6, 8, 10].includes(rate)) {
      errors.push('Invalid KiwiSaver rate (must be 3%, 4%, 6%, 8%, or 10%)');
    }
  }

  // Tax code validation (if provided)
  if (employee.taxCode) {
    const validTaxCodes = ['M', 'M SL', 'S', 'S SL', 'SH', 'SH SL', 'ST', 'ST SL'];
    if (!validTaxCodes.includes(employee.taxCode)) {
      errors.push('Invalid tax code');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Generate template with test data
export const generateTemplate = (): XLSX.WorkBook => {
  const data = [
    ['Employee Import Template'],
    ['Instructions:', 'Fill in the employee data below. Required fields are marked with *'],
    [''],
    [
      'Name*',
      'Email*',
      'Position*',
      'Department*',
      'Start Date*',
      'Status',
      'Salary',
      'Phone Number',
      'Emergency Contact',
      'Address',
      'Tax Code',
      'KiwiSaver Rate',
      'Bank Account',
      'IRD Number'
    ],
    ...TEST_EMPLOYEES.map(emp => [
      emp.name,
      emp.email,
      emp.position,
      emp.department,
      emp.startDate,
      emp.status,
      emp.salary,
      emp.phoneNumber,
      emp.emergencyContact,
      emp.address,
      emp.taxCode,
      emp.kiwiSaverRate,
      emp.bankAccount,
      emp.irdNumber
    ])
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  return wb;
};

// Parse imported data
export const parseImportData = (workbook: XLSX.WorkBook): {
  employees: Partial<Employee>[];
  errors: { row: number; errors: string[] }[];
} => {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  // Find header row
  const headerRowIndex = rows.findIndex(row => 
    row.some(cell => 
      cell?.toString().toLowerCase().includes('name') &&
      cell?.toString().includes('*')
    )
  );

  if (headerRowIndex === -1) {
    throw new Error('Invalid file format: No header row found');
  }

  const headers = rows[headerRowIndex].map(h => 
    h?.toString().toLowerCase().replace('*', '').trim()
  );
  const dataRows = rows.slice(headerRowIndex + 1);

  const employees: Partial<Employee>[] = [];
  const errors: { row: number; errors: string[] }[] = [];

  dataRows.forEach((row, index) => {
    if (!row.some(cell => cell)) return; // Skip empty rows

    const employee: Partial<Employee> = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'active'
    };

    headers.forEach((header, colIndex) => {
      const value = row[colIndex];
      if (value !== undefined && value !== null && value !== '') {
        switch (header) {
          case 'name':
            employee.name = value.toString().trim();
            break;
          case 'email':
            employee.email = value.toString().trim();
            break;
          case 'position':
            employee.position = value.toString().trim();
            break;
          case 'department':
            employee.department = value.toString().trim();
            break;
          case 'start date':
            employee.startDate = format(new Date(value), 'yyyy-MM-dd');
            break;
          case 'status':
            employee.status = value.toString().toLowerCase() as any;
            break;
          case 'salary':
            employee.salary = value.toString();
            break;
          case 'phone number':
            employee.phoneNumber = value.toString();
            break;
          case 'emergency contact':
            employee.emergencyContact = value.toString();
            break;
          case 'address':
            employee.address = value.toString();
            break;
          case 'tax code':
            employee.taxCode = value.toString().toUpperCase();
            break;
          case 'kiwisaver rate':
            employee.kiwiSaverRate = value.toString();
            break;
          case 'bank account':
            employee.bankAccount = value.toString();
            break;
          case 'ird number':
            employee.irdNumber = value.toString();
            break;
        }
      }
    });

    const validation = validateEmployee(employee);
    if (!validation.valid) {
      errors.push({
        row: index + headerRowIndex + 2,
        errors: validation.errors
      });
    } else {
      employees.push(employee);
    }
  });

  return { employees, errors };
};