import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface CourseRatingProps {
  initialRating?: number;
  onRate: (rating: number) => void;
}

export const CourseRating = ({ initialRating = 0, onRate }: CourseRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleRate = (value: number) => {
    setRating(value);
    onRate(value);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          onMouseEnter={() => setHover(value)}
          onMouseLeave={() => setHover(0)}
          onClick={() => handleRate(value)}
          className="focus:outline-none"
        >
          <Star
            className={`w-6 h-6 ${
              value <= (hover || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};