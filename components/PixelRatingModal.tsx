'use client';

import { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';

export default function PixelRatingModal({ onSubmit, onCancel }: { onSubmit: (rating: number) => void, onCancel: () => void }) {
  const [rating, setRating] = useState(0);

  const getStarType = (star: number) => {
    if (rating >= star) return 'full';
    if (rating >= star - 0.5) return 'half';
    return 'empty';
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-retro-black pixel-border p-8 text-center max-w-md w-full">
        <h2 className="text-3xl text-retro-purple mb-6">RATE REPOSITORY</h2>
        <div className="text-retro-green text-xl mb-4">{rating.toFixed(1)} / 5.0</div>
        <div className="flex justify-center gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="relative w-12 h-12">
              <button
                onClick={() => setRating(star - 0.5)}
                className="absolute left-0 top-0 h-full w-1/2 z-10"
                aria-label={`Rate ${star - 0.5} stars`}
              />
              <button
                onClick={() => setRating(star)}
                className="absolute right-0 top-0 h-full w-1/2 z-10"
                aria-label={`Rate ${star} stars`}
              />
              <div className={`transition-colors ${getStarType(star) !== 'empty' ? 'text-retro-green' : 'text-gray-600 hover:text-retro-purple'}`}>
                {getStarType(star) === 'half' ? (
                  <StarHalf className="w-12 h-12 fill-current" />
                ) : (
                  <Star className="w-12 h-12 fill-current" />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 bg-gray-800 text-white px-4 py-3 pixel-border hover:bg-gray-700">
            CANCEL
          </button>
          <button
            onClick={() => onSubmit(rating)}
            disabled={rating === 0}
            className="flex-1 bg-retro-green text-black px-4 py-3 pixel-shadow-green pixel-shadow-green-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SUBMIT SCORE
          </button>
        </div>
      </div>
    </div>
  );
}
