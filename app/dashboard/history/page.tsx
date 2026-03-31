'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function History() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getRatingPercent = (rating: number) => {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    return `${(safeRating / 5) * 100}%`;
  };

  useEffect(() => {
    fetch('/api/get-reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl text-retro-purple glitch-text" data-text="REVIEW HISTORY">
          REVIEW HISTORY
        </h2>
        <Link href="/dashboard" className="bg-retro-purple text-white px-6 py-3 pixel-shadow pixel-shadow-hover text-xl">
          BACK
        </Link>
      </div>

      {loading ? (
        <div className="text-retro-green text-2xl animate-pulse text-center mt-20">
          LOADING SAVE DATA...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-500 text-xl text-center mt-20">
          NO REVIEWS SAVED YET
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-retro-black/80 pixel-border p-6">
              <div className="flex justify-between items-start mb-4">
                <a
                  href={review.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-retro-green text-xl hover:underline truncate max-w-[70%]"
                >
                  {review.repoUrl}
                </a>
                <div className="text-retro-purple text-xl shrink-0 flex items-center gap-2">
                  <div className="relative leading-none tracking-[2px]">
                    <div className="text-gray-700">★★★★★</div>
                    <div className="absolute left-0 top-0 overflow-hidden text-retro-purple" style={{ width: getRatingPercent(review.rating) }}>
                      ★★★★★
                    </div>
                  </div>
                  <span className="text-retro-green text-base">{Number(review.rating).toFixed(1)}</span>
                </div>
              </div>

              <div className="text-gray-500 text-sm mb-4">
                {new Date(review.createdAt).toLocaleString()}
              </div>

              {review.chatLogs && review.chatLogs.length > 0 && (
                <div className="mt-4">
                  <div className="text-retro-purple text-sm mb-2">CHAT LOG</div>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {review.chatLogs.map((msg: any, j: number) => (
                      <div key={j} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <span className={`text-xs mb-1 ${msg.role === 'user' ? 'text-retro-green' : 'text-retro-purple'}`}>
                          {msg.role === 'user' ? 'JUDGE' : 'AI'}
                        </span>
                        <div className={`p-2 text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-retro-green/20 pixel-border-green' : 'bg-retro-purple/20 pixel-border'}`}>
                          {msg.parts?.map((part: any, k: number) =>
                            part.type === 'text' ? <span key={k}>{part.text}</span> : null
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}