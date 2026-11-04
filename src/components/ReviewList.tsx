import React from 'react';
import { Star, Trash2, Calendar, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import api from '../api/axios.js';

export interface ReviewItem {
  _id: string;
  place: string;
  user: {
    _id?: string;
    name?: string;
    role?: string;
  };
  rating: number;
  text: string;
  photos: string[];
  createdAt: string;
}

interface ReviewListProps {
  reviews: ReviewItem[];
  onReviewDeleted: (reviewId: string) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, onReviewDeleted }) => {
  const { user, isAdmin } = useAuth();

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await api.delete(`/api/reviews/${reviewId}`);
      if (res.data.success) {
        onReviewDeleted(reviewId);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not delete review');
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 text-center text-slate-500">
        <p className="font-semibold text-sm">No reviews yet for this place.</p>
        <p className="text-xs mt-1">Be the first to share your accessibility feedback!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((rev) => {
        const canDelete =
          isAdmin || (user && rev.user && (rev.user._id === user.id || rev.user === user.id as any));

        const formattedDate = new Date(rev.createdAt).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        return (
          <div
            key={rev._id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  {(rev.user?.name || 'Citizen').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-xs text-slate-900">
                      {rev.user?.name || 'Verified Citizen'}
                    </span>
                    {rev.user?.role === 'admin' && (
                      <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(rev._id)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed pl-10">{rev.text}</p>

            {rev.photos && rev.photos.length > 0 && (
              <div className="flex flex-wrap gap-2 pl-10 pt-1">
                {rev.photos.map((p, idx) => (
                  <img
                    key={idx}
                    src={p}
                    alt="Review attachment"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-xs"
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
