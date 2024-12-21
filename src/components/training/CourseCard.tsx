import React from 'react';
import { Clock, Award, Users, Star, Play, CheckCircle } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: string;
    modules: {
      title: string;
      content: string;
      duration: string;
    }[];
    enrollmentCount?: number;
    rating?: number;
  };
  onEnroll: (courseId: string) => void;
  enrolled?: boolean;
  progress?: number;
  variant?: 'popular' | 'recommended' | 'default';
}

export const CourseCard = ({ 
  course, 
  onEnroll, 
  enrolled, 
  progress = 0,
  variant = 'default' 
}: CourseCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'popular':
        return 'border-yellow-200 hover:border-yellow-300';
      case 'recommended':
        return 'border-green-200 hover:border-green-300';
      default:
        return 'border-gray-200 hover:border-gray-300';
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all border-2 ${getVariantStyles()}`}
    >
      <div className="p-6">
        {variant !== 'default' && (
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
            variant === 'popular' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
          }`}>
            {variant === 'popular' ? 'Popular Course' : 'Recommended'}
          </div>
        )}

        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
          {course.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">{course.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{course.description}</p>
        
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration}
          </div>
          <div className="flex items-center">
            <Award className="w-4 h-4 mr-1" />
            {course.level}
          </div>
          {course.enrollmentCount && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {course.enrollmentCount} enrolled
            </div>
          )}
        </div>

        {enrolled && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {progress === 100 ? 'Completed' : 'In Progress'}
              </span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  progress === 100 ? 'bg-green-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        <button
          onClick={() => onEnroll(course.id)}
          className={`mt-4 w-full ${
            enrolled 
              ? progress === 100
                ? 'btn-secondary'
                : 'btn-primary'
              : 'btn-primary'
          } flex items-center justify-center space-x-2`}
        >
          {enrolled ? (
            progress === 100 ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Review Course</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Continue Learning</span>
              </>
            )
          ) : (
            <span>Enroll Now</span>
          )}
        </button>
      </div>
    </div>
  );
};