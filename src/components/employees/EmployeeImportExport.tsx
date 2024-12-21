import React, { useRef, useState } from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { Download, Upload, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { generateTemplate, parseImportData } from '../../utils/employeeDataUtils';
import toast from 'react-hot-toast';

export const EmployeeImportExport = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const { employees, addEmployee } = useEmployeeStore();

  const handleExport = () => {
    try {
      // Create workbook with current employees
      const data = [
        ['Employee Export'],
        ['Generated:', new Date().toLocaleString()],
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
        ...employees.map(emp => [
          emp.name,
          emp.email,
          emp.position,
          emp.department,
          emp.startDate,
          emp.status,
          emp.salary || '',
          emp.phoneNumber || '',
          emp.emergencyContact || '',
          emp.address || '',
          emp.taxCode || '',
          emp.kiwiSaverRate || '',
          emp.bankAccount || '',
          emp.irdNumber || ''
        ])
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employees');
      XLSX.writeFile(wb, `employees-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Employee data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export employee data');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const { employees: importedEmployees, errors } = parseImportData(workbook);

      if (errors.length > 0) {
        console.error('Import errors:', errors);
        toast.error(
          <div>
            <p>Import completed with errors:</p>
            <ul className="mt-2 list-disc list-inside">
              {errors.map((error, i) => (
                <li key={i}>
                  Row {error.row}: {error.errors.join(', ')}
                </li>
              ))}
            </ul>
          </div>,
          { duration: 5000 }
        );
      }

      importedEmployees.forEach(employee => {
        addEmployee({
          ...employee,
          id: Math.random().toString(36).substr(2, 9),
        });
      });

      if (importedEmployees.length > 0) {
        toast.success(`Successfully imported ${importedEmployees.length} employees`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import employee data');
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadTemplate = () => {
    try {
      const wb = generateTemplate();
      XLSX.writeFile(wb, 'employee-import-template.xlsx');
      toast.success('Template downloaded successfully');
    } catch (error) {
      console.error('Template download error:', error);
      toast.error('Failed to download template');
    }
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={handleExport}
        className="btn-secondary flex items-center space-x-2"
      >
        <Download size={20} />
        <span>Export</span>
      </button>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleImport}
          className="hidden"
          id="employee-import"
        />
        <label
          htmlFor="employee-import"
          className={`btn-secondary flex items-center space-x-2 cursor-pointer ${
            importing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload size={20} />
          <span>{importing ? 'Importing...' : 'Import'}</span>
        </label>
      </div>

      <button
        onClick={handleDownloadTemplate}
        className="btn-secondary flex items-center space-x-2"
      >
        <AlertCircle size={20} />
        <span>Template</span>
      </button>
    </div>
  );
};