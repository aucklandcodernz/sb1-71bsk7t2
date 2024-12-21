import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { useTrainingStore } from '../../store/trainingStore';

interface CourseFormProps {
  onClose: () => void;
}

export const CourseForm = ({ onClose }: CourseFormProps) => {
  const addCourse = useTrainingStore((state) => state.addCourse);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'beginner',
    modules: [{ title: '', content: '', duration: '' }],
    requirements: [''],
    objectives: [''],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCourse(formData);
    onClose();
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: '', content: '', duration: '' }],
    });
  };

  const updateModule = (index: number, field: string, value: string) => {
    const newModules = [...formData.modules];
    newModules[index] = { ...newModules[index], [field]: value };
    setFormData({ ...formData, modules: newModules });
  };

  const addListItem = (field: 'requirements' | 'objectives') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const updateListItem = (field: 'requirements' | 'objectives', index: number, value: string) => {
    const newList = [...formData[field]];
    newList[index] = value;
    setFormData({ ...formData, [field]: newList });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create New Course</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="e.g., Health & Safety Fundamentals"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Brief description of the course"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input-field"
                placeholder="e.g., 2 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="input-field"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Modules</label>
            {formData.modules.map((module, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Module Title"
                    value={module.title}
                    onChange={(e) => updateModule(index, 'title', e.target.value)}
                    className="input-field"
                  />
                  <textarea
                    placeholder="Module Content"
                    value={module.content}
                    onChange={(e) => updateModule(index, 'content', e.target.value)}
                    className="input-field"
                    rows={2}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 30 minutes)"
                    value={module.duration}
                    onChange={(e) => updateModule(index, 'duration', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addModule}
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Add Module
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              {formData.requirements.map((req, index) => (
                <input
                  key={index}
                  type="text"
                  value={req}
                  onChange={(e) => updateListItem('requirements', index, e.target.value)}
                  className="input-field mb-2"
                  placeholder="Prerequisite or requirement"
                />
              ))}
              <button
                type="button"
                onClick={() => addListItem('requirements')}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                + Add Requirement
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives</label>
              {formData.objectives.map((obj, index) => (
                <input
                  key={index}
                  type="text"
                  value={obj}
                  onChange={(e) => updateListItem('objectives', index, e.target.value)}
                  className="input-field mb-2"
                  placeholder="Learning objective"
                />
              ))}
              <button
                type="button"
                onClick={() => addListItem('objectives')}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                + Add Objective
              </button>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center">
              <BookOpen size={20} className="mr-2" />
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};