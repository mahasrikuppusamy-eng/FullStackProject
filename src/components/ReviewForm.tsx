import React, { useState } from 'react';
import { Star, Send, ImagePlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import api from '../api/axios.js';

interface ReviewFormProps {
  placeId: string;
  onReviewAdded: (newReview: any, updatedPlace: any) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ placeId, onReviewAdded }) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
        <p className="text-slate-700 font-medium text-sm">
          Have you visited this place in Coimbatore?
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Please sign in to share your verified accessibility review.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please provide feedback about accessibility.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const photos = photoUrl.trim() ? [photoUrl.trim()] : [];
      const res = await api.post(`/api/places/${placeId}/reviews`, {
        rating,
        text: text.trim(),
        photos,
      });

      if (res.data.success) {
        setText('');
        setPhotoUrl('');
        setRating(5);
        onReviewAdded(res.data.review, res.data.place);
      } else {
        setError(res.data.message || 'Could not post review.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error submitting review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <h4 className="font-bold text-slate-900 text-sm">Write an Accessibility Review</h4>

      {error && (
        <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Star Selector */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">
          Accessibility Rating (1 to 5 Stars)
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-1 focus:outline-hidden hover:scale-110 transition-transform"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  (hoverRating || rating) >= star
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200'
                }`}
              />
            </button>
          ))}
          <span className="text-xs font-bold text-amber-600 ml-2">
            {rating} of 5 Stars
          </span>
        </div>
      </div>

      {/* Review text */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">
          Your Experience (Ramp angle, restroom grab rails, elevator clearance, parking)
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Ramp slope was gentle and wheelchair easily navigated the entrance. Restroom had working grab bars."
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          required
        />
      </div>

      {/* Optional Photo URL */}
      <div>
        <label className="text-xs font-semibold text-slate-600 flex items-center mb-1">
          <ImagePlus className="w-3.5 h-3.5 mr-1" />
          Photo URL (Optional Entrance / Ramp photo)
        </label>
        <input
          type="url"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="https://example.com/ramp.jpg"
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{submitting ? 'Submitting...' : 'Post Verified Review'}</span>
      </button>
    </form>
  );
};

export default ReviewForm;
