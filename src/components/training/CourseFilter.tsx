import React from 'react';
import { Search } from 'lucide-react';

interface CourseFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
}

export const CourseFilter = ({ onSearch, onFilterChange }: CourseFilterProps) => {
  return (
    <div className="flex space-x-4 mb-6">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search courses..."
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>
      
      <select
        onChange={(e) => onFilterChange(e.target.value)}
        className="border rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Levels</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
    </div>
  );
};