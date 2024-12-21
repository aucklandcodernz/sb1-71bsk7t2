import React from 'react';
import { useRecognitionStore } from '../../store/recognitionStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { format } from 'date-fns';
import { MessageSquare, Heart, Award, ThumbsUp, Star } from 'lucide-react';

interface RecognitionFeedProps {
  teamId?: string;
  employeeId?: string;
}

export const RecognitionFeed = ({ teamId, employeeId }: RecognitionFeedProps) => {
  const { recognitions, addReaction, addComment } = useRecognitionStore();
  const employees = useEmployeeStore((state) => state.employees);

  const getEmployeeName = (id: string) => {
    const employee = employees.find(e => e.id === id);
    return employee?.name || 'Unknown Employee';
  };

  const filteredRecognitions = teamId
    ? recognitions.filter(r => r.visibility !== 'private')
    : employeeId
    ? recognitions.filter(r => r.toEmployeeId === employeeId || r.fromEmployeeId === employeeId)
    : recognitions;

  const handleReaction = (recognitionId: string, employeeId: string, type: string) => {
    addReaction(recognitionId, employeeId, type);
  };

  const handleComment = (recognitionId: string, employeeId: string) => {
    const message = prompt('Enter your comment:');
    if (message) {
      addComment(recognitionId, employeeId, message);
    }
  };

  return (
    <div className="space-y-6">
      {filteredRecognitions.map((recognition) => (
        <div key={recognition.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Award className="text-indigo-600" size={24} />
                <div>
                  <p className="font-medium">
                    {getEmployeeName(recognition.fromEmployeeId)} recognized{' '}
                    {getEmployeeName(recognition.toEmployeeId)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(recognition.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-medium">{recognition.title}</h3>
                <p className="mt-1 text-gray-600">{recognition.message}</p>
              </div>
            </div>
            {recognition.badges && recognition.badges.length > 0 && (
              <div className="flex space-x-2">
                {recognition.badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => handleReaction(recognition.id, 'current-user', 'like')}
                className="flex items-center text-gray-500 hover:text-indigo-600"
              >
                <ThumbsUp className="w-5 h-5 mr-1" />
                <span className="text-sm">
                  {recognition.reactions.filter(r => r.type === 'like').length}
                </span>
              </button>
              <button
                onClick={() => handleReaction(recognition.id, 'current-user', 'heart')}
                className="flex items-center text-gray-500 hover:text-red-600"
              >
                <Heart className="w-5 h-5 mr-1" />
                <span className="text-sm">
                  {recognition.reactions.filter(r => r.type === 'heart').length}
                </span>
              </button>
              <button
                onClick={() => handleComment(recognition.id, 'current-user')}
                className="flex items-center text-gray-500 hover:text-blue-600"
              >
                <MessageSquare className="w-5 h-5 mr-1" />
                <span className="text-sm">{recognition.comments.length}</span>
              </button>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              recognition.visibility === 'public'
                ? 'bg-green-100 text-green-800'
                : recognition.visibility === 'team'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {recognition.visibility.toUpperCase()}
            </span>
          </div>

          {recognition.comments.length > 0 && (
            <div className="mt-4 space-y-2">
              {recognition.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{getEmployeeName(comment.employeeId)}</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.createdAt), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{comment.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};