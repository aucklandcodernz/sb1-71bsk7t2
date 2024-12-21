import React, { useState } from 'react';
import { usePerformanceStore } from '../../store/performanceStore';
import { Star, AlertCircle, Save, X } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import toast from 'react-hot-toast';

interface PerformanceReviewFormProps {
  employeeId: string;
  onClose: () => void;
}

export const PerformanceReviewForm = ({ employeeId, onClose }: PerformanceReviewFormProps) => {
  const templates = usePerformanceStore((state) => state.templates);
  const addReview = usePerformanceStore((state) => state.addReview);

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [formData, setFormData] = useState({
    reviewDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    type: 'annual' as const,
    ratings: {} as Record<string, number>,
    competencies: {
      technical: [] as { name: string; rating: number; comments: string }[],
      soft: [] as { name: string; rating: number; comments: string }[],
      leadership: [] as { name: string; rating: number; comments: string }[],
    },
    goals: {
      previous: [] as { id: string; description: string; status: string }[],
      current: [{ id: '1', description: '', measures: [], status: 'not_started' }],
    },
    feedback: {
      strengths: [''],
      improvements: [''],
      comments: '',
    },
    development: {
      trainingNeeds: [''],
      careerPath: '',
      actionItems: [''],
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      addReview({
        employeeId,
        reviewerId: 'current-user', // In a real app, get from auth context
        status: 'draft',
        ...formData,
      });

      toast.success('Performance review created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to create performance review');
    }
  };

  const handleRatingChange = (competencyType: keyof typeof formData.competencies, index: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      competencies: {
        ...prev.competencies,
        [competencyType]: prev.competencies[competencyType].map((comp, i) =>
          i === index ? { ...comp, rating: value } : comp
        ),
      },
    }));
  };

  const handleAddGoal = () => {
    setFormData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        current: [
          ...prev.goals.current,
          {
            id: Math.random().toString(),
            description: '',
            measures: [],
            status: 'not_started',
          },
        ],
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">New Performance Review</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Review Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="input-field"
                >
                  <option value="probation">Probation Review</option>
                  <option value="quarterly">Quarterly Review</option>
                  <option value="annual">Annual Review</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="input-field"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Competencies</h3>
              {['technical', 'soft', 'leadership'].map((type) => (
                <div key={type} className="mb-6">
                  <h4 className="font-medium text-gray-700 capitalize mb-2">
                    {type} Skills
                  </h4>
                  <div className="space-y-4">
                    {selectedTemplate.sections.competencies[type]?.map((skill, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {skill}
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => handleRatingChange(type as any, index, rating)}
                                className={`p-2 rounded-full ${
                                  formData.competencies[type][index]?.rating === rating
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'text-gray-400 hover:text-yellow-600'
                                }`}
                              >
                                <Star size={20} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Comments
                          </label>
                          <textarea
                            value={formData.competencies[type][index]?.comments || ''}
                            onChange={(e) => {
                              const newCompetencies = [...formData.competencies[type]];
                              newCompetencies[index] = {
                                ...newCompetencies[index],
                                comments: e.target.value,
                              };
                              setFormData(prev => ({
                                ...prev,
                                competencies: {
                                  ...prev.competencies,
                                  [type]: newCompetencies,
                                },
                              }));
                            }}
                            className="input-field"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Goals</h3>
              <div className="space-y-4">
                {formData.goals.current.map((goal, index) => (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Goal Description
                      </label>
                      <textarea
                        value={goal.description}
                        onChange={(e) => {
                          const newGoals = [...formData.goals.current];
                          newGoals[index] = {
                            ...newGoals[index],
                            description: e.target.value,
                          };
                          setFormData(prev => ({
                            ...prev,
                            goals: {
                              ...prev.goals,
                              current: newGoals,
                            },
                          }));
                        }}
                        className="input-field"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Success Measures
                      </label>
                      <input
                        type="text"
                        placeholder="Add measures (comma-separated)"
                        onChange={(e) => {
                          const newGoals = [...formData.goals.current];
                          newGoals[index] = {
                            ...newGoals[index],
                            measures: e.target.value.split(',').map(m => m.trim()),
                          };
                          setFormData(prev => ({
                            ...prev,
                            goals: {
                              ...prev.goals,
                              current: newGoals,
                            },
                          }));
                        }}
                        className="input-field"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddGoal}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  + Add Goal
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Feedback</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Strengths
                  </label>
                  {formData.feedback.strengths.map((strength, index) => (
                    <div key={index} className="mt-2">
                      <input
                        type="text"
                        value={strength}
                        onChange={(e) => {
                          const newStrengths = [...formData.feedback.strengths];
                          newStrengths[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            feedback: {
                              ...prev.feedback,
                              strengths: newStrengths,
                            },
                          }));
                        }}
                        className="input-field"
                        placeholder="Add strength"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      feedback: {
                        ...prev.feedback,
                        strengths: [...prev.feedback.strengths, ''],
                      },
                    }))}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    + Add Strength
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Areas for Improvement
                  </label>
                  {formData.feedback.improvements.map((improvement, index) => (
                    <div key={index} className="mt-2">
                      <input
                        type="text"
                        value={improvement}
                        onChange={(e) => {
                          const newImprovements = [...formData.feedback.improvements];
                          newImprovements[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            feedback: {
                              ...prev.feedback,
                              improvements: newImprovements,
                            },
                          }));
                        }}
                        className="input-field"
                        placeholder="Add improvement area"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      feedback: {
                        ...prev.feedback,
                        improvements: [...prev.feedback.improvements, ''],
                      },
                    }))}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    + Add Improvement Area
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Comments
                  </label>
                  <textarea
                    value={formData.feedback.comments}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      feedback: {
                        ...prev.feedback,
                        comments: e.target.value,
                      },
                    }))}
                    className="input-field"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Development Plan</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Training Needs
                  </label>
                  {formData.development.trainingNeeds.map((need, index) => (
                    <div key={index} className="mt-2">
                      <input
                        type="text"
                        value={need}
                        onChange={(e) => {
                          const newNeeds = [...formData.development.trainingNeeds];
                          newNeeds[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            development: {
                              ...prev.development,
                              trainingNeeds: newNeeds,
                            },
                          }));
                        }}
                        className="input-field"
                        placeholder="Add training need"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      development: {
                        ...prev.development,
                        trainingNeeds: [...prev.development.trainingNeeds, ''],
                      },
                    }))}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    + Add Training Need
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Career Path
                  </label>
                  <textarea
                    value={formData.development.careerPath}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      development: {
                        ...prev.development,
                        careerPath: e.target.value,
                      },
                    }))}
                    className="input-field"
                    rows={3}
                    placeholder="Describe career development path"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Action Items
                  </label>
                  {formData.development.actionItems.map((item, index) => (
                    <div key={index} className="mt-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = [...formData.development.actionItems];
                          newItems[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            development: {
                              ...prev.development,
                              actionItems: newItems,
                            },
                          }));
                        }}
                        className="input-field"
                        placeholder="Add action item"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      development: {
                        ...prev.development,
                        actionItems: [...prev.development.actionItems, ''],
                      },
                    }))}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    + Add Action Item
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-start">
              <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
              <p className="text-sm text-blue-700">
                This review will be saved as a draft until all required fields are completed.
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="performance-review-form"
                className="btn-primary flex items-center space-x-2"
              >
                <Save size={20} />
                <span>Save Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};