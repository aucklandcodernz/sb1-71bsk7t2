import React, { useState } from 'react';
import { CheckCircle, Circle, PlayCircle, Download, FileText, Clock, Award } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  content: string;
  duration: string;
  resources?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  quiz?: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

interface CourseContentProps {
  modules: Module[];
  completedModuleIds: string[];
  currentModuleId: string;
  onModuleSelect: (moduleId: string) => void;
}

export const CourseContent = ({
  modules,
  completedModuleIds = [],
  currentModuleId,
  onModuleSelect,
}: CourseContentProps) => {
  const [selectedModuleId, setSelectedModuleId] = useState(currentModuleId);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentModuleIndex = modules.findIndex(m => m.id === currentModuleId);
  const selectedModule = modules.find(m => m.id === selectedModuleId);

  const handleModuleClick = (moduleId: string) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    const previousModule = modules[moduleIndex - 1];
    
    if (moduleIndex > currentModuleIndex && previousModule && !completedModuleIds?.includes(previousModule.id)) {
      return; // Prevent skipping modules
    }
    
    setSelectedModuleId(moduleId);
    setShowQuiz(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const calculateQuizScore = () => {
    if (!selectedModule?.quiz) return 0;
    return selectedModule.quiz.reduce((score, question) => {
      return score + (quizAnswers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const score = calculateQuizScore();
    const totalQuestions = selectedModule?.quiz?.length || 0;
    
    if (score >= totalQuestions * 0.7) { // Pass threshold: 70%
      onModuleSelect(selectedModuleId);
    }
  };

  if (!selectedModule) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Module List */}
      <div className="lg:col-span-1 space-y-4">
        {modules.map((module, index) => {
          const isCompleted = completedModuleIds?.includes(module.id);
          const isSelected = selectedModuleId === module.id;
          const moduleIndex = modules.findIndex(m => m.id === module.id);
          const isLocked = moduleIndex > currentModuleIndex && 
            !completedModuleIds?.includes(modules[moduleIndex - 1]?.id);

          return (
            <div
              key={`module-${module.id}`}
              className={`p-4 rounded-lg border ${
                isSelected 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : isLocked
                    ? 'border-gray-200 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:bg-gray-50 cursor-pointer'
              } transition-colors`}
              onClick={() => !isLocked && handleModuleClick(module.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : isSelected ? (
                    <PlayCircle className="w-5 h-5 text-indigo-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{module.title}</h4>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {module.duration}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Content */}
      <div className="lg:col-span-2">
        {!showQuiz ? (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">{selectedModule.title}</h3>
            
            <div className="prose max-w-none">
              <p>{selectedModule.content}</p>
            </div>

            {selectedModule.resources && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Resources</h4>
                <div className="space-y-2">
                  {selectedModule.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                        <p className="text-xs text-gray-500">{resource.type}</p>
                      </div>
                      <Download className="w-5 h-5 text-gray-400 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {selectedModule.quiz && !completedModuleIds?.includes(selectedModuleId) && (
              <button
                onClick={() => setShowQuiz(true)}
                className="mt-6 btn-primary w-full"
              >
                Take Quiz to Complete Module
              </button>
            )}

            {!selectedModule.quiz && !completedModuleIds?.includes(selectedModuleId) && (
              <button
                onClick={() => onModuleSelect(selectedModuleId)}
                className="mt-6 btn-primary w-full"
              >
                Complete Module
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-6">Module Quiz</h3>
            
            <div className="space-y-6">
              {selectedModule.quiz?.map((question, questionIndex) => (
                <div key={`quiz-question-${question.id}`} className="border rounded-lg p-4">
                  <p className="font-medium mb-4">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={`quiz-option-${questionIndex}-${optionIndex}`}
                        onClick={() => handleQuizAnswer(question.id, optionIndex)}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-3 rounded-lg border ${
                          quizAnswers[question.id] === optionIndex
                            ? quizSubmitted
                              ? optionIndex === question.correctAnswer
                                ? 'bg-green-100 border-green-500'
                                : 'bg-red-100 border-red-500'
                              : 'bg-indigo-50 border-indigo-500'
                            : quizSubmitted && optionIndex === question.correctAnswer
                            ? 'bg-green-100 border-green-500'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleQuizSubmit}
                disabled={!selectedModule.quiz || Object.keys(quizAnswers).length !== selectedModule.quiz.length}
                className="mt-6 btn-primary w-full"
              >
                Submit Quiz
              </button>
            ) : (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center justify-center">
                  <Award className="w-8 h-8 text-indigo-500 mr-2" />
                  <span className="text-lg font-medium">
                    Score: {calculateQuizScore()} / {selectedModule.quiz?.length}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {calculateQuizScore() >= ((selectedModule.quiz?.length || 0) * 0.7)
                    ? 'Congratulations! You have passed the quiz.'
                    : 'You need 70% to pass. Please try again.'}
                </p>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="mt-4 btn-secondary w-full"
                >
                  Return to Module
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};