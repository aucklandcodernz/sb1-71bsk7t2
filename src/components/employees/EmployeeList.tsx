import React, { useState } from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { usePermissions } from '../../hooks/usePermissions';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Employee } from '../../types';
import { EmployeeActions } from './EmployeeActions';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';

const columnHelper = createColumnHelper<Employee>();

interface EmployeeListProps {
  filters: {
    department: string;
    status: string;
    searchQuery: string;
  };
  onTimeTrack: (employeeId: string) => void;
  onSelectEmployee: (employeeId: string) => void;
}

export const EmployeeList = ({ filters, onTimeTrack, onSelectEmployee }: EmployeeListProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const employees = useEmployeeStore((state) => state.employees);
  const { hasPermission } = usePermissions();

  const formatSalary = (salary: string | undefined) => {
    if (!salary || !hasPermission('view_salary')) return '-';
    const amount = parseFloat(salary);
    if (isNaN(amount)) return '-';
    return `$${amount.toLocaleString()} p.a.`;
  };

  const columns = [
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1"
          onClick={() => column.toggleSorting()}
        >
          <span>Name</span>
          {{
            asc: <ChevronUp size={16} />,
            desc: <ChevronDown size={16} />,
          }[column.getIsSorted() as string] ?? null}
        </button>
      ),
      cell: (info) => (
        <button
          onClick={() => onSelectEmployee(info.row.original.id)}
          className="text-indigo-600 hover:text-indigo-800"
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('position', {
      header: 'Position',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('department', {
      header: 'Department',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('startDate', {
      header: 'Start Date',
      cell: (info) => format(new Date(info.getValue()), 'MMM d, yyyy'),
    }),
    columnHelper.accessor('salary', {
      header: 'Salary/Rate',
      cell: (info) => formatSalary(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            info.getValue() === 'active'
              ? 'bg-green-100 text-green-800'
              : info.getValue() === 'on_leave'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {info.getValue().replace('_', ' ').toUpperCase()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <EmployeeActions
          employee={info.row.original}
          onTimeTrack={onTimeTrack}
          onSelect={() => onSelectEmployee(info.row.original.id)}
        />
      ),
    }),
  ];

  const filteredData = React.useMemo(() => {
    return employees.filter((employee) => {
      if (filters.department && employee.department !== filters.department) {
        return false;
      }
      if (filters.status && employee.status !== filters.status) {
        return false;
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          employee.name.toLowerCase().includes(query) ||
          employee.position?.toLowerCase().includes(query) ||
          employee.department?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [employees, filters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No employees found
          </div>
        )}
      </div>
    </div>
  );
};