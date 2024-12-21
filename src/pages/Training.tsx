import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTrainingStore } from '../store/trainingStore';
import { CourseCard } from '../components/training/CourseCard';
import { CourseContent } from '../components/training/CourseContent';
import { CourseForm } from '../components/training/CourseForm';
import { CourseFilter } from '../components/training/CourseFilter';
import { TrainingStats } from '../components/training/TrainingStats';

const Training = () => {
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const {
    courses,
    enrolledCourses,
    enrollInCourse,
    updateProgress,
    getPopularCourses,
    getRecommendedCourses,
  } = useTrainingStore();

  const popularCourses = getPopularCourses();
  const recommendedCourses = getRecommendedCourses();

  const handleEnroll = (courseId: string) => {
    enrollInCourse(courseId);
  };

  const handleModuleComplete = (courseId: string, moduleId: string) => {
    updateProgress(courseId, moduleId);
  };

  const selectedCourseData = selectedCourse
    ? [...courses, ...enrolledCourses].find((c) => c.id === selectedCourse)
    : null;

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !levelFilter || course.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training</h1>
          <p className="text-gray-500">Enhance your skills with our courses</p>
        </div>
        <button
          onClick={() => setShowCourseForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Course</span>
        </button>
      </div>

      <TrainingStats />

      <CourseFilter
        onSearch={setSearchQuery}
        onFilterChange={setLevelFilter}
      />

      {enrolledCourses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={() => setSelectedCourse(course.id)}
                enrolled
                progress={course.progress}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Available Courses</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={handleEnroll}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Popular Courses</h2>
            <div className="space-y-4">
              {popularCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                  variant="popular"
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recommended for You</h2>
            <div className="space-y-4">
              {recommendedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                  variant="recommended"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedCourseData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{selectedCourseData.title}</h2>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <CourseContent
              modules={selectedCourseData.modules}
              completedModuleIds={
                'completedModuleIds' in selectedCourseData
                  ? selectedCourseData.completedModuleIds
                  : []
              }
              currentModuleId={
                'currentModuleId' in selectedCourseData
                  ? selectedCourseData.currentModuleId
                  : selectedCourseData.modules[0]?.id || ''
              }
              onModuleSelect={(moduleId) =>
                handleModuleComplete(selectedCourseData.id, moduleId)
              }
            />
          </div>
        </div>
      )}

      {showCourseForm && <CourseForm onClose={() => setShowCourseForm(false)} />}
    </div>
  );
};

export default Training;