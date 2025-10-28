'use client';

import { useState, useEffect } from 'react';

interface RatingStats {
  average_rating: number;
  total_ratings: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

interface TrustScoreRatingProps {
  projectId: string;
}

export default function TrustScoreRating({ projectId }: TrustScoreRatingProps) {
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchRatings = async () => {
    try {
      const res = await fetch(`/api/ratings?project_id=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch {
      console.error('Failed to fetch ratings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !rating) {
      setError('Nama, email, dan rating harus diisi');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          email,
          name,
          rating,
          comment: comment || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal mengirim rating');
        return;
      }

      setSuccess('Rating berhasil dikirim!');
      setShowForm(false);
      setRating(0);
      setComment('');
      fetchRatings();
    } catch {
      setError('Terjadi kesalahan saat mengirim rating');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-2">
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 w-12">{count}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const avgRating = stats?.average_rating || 0;
  const totalRatings = stats?.total_ratings || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">⭐ Skor Kepercayaan Komunitas</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Average Rating Display */}
        <div className="text-center">
          <div className="text-6xl font-bold text-yellow-500 mb-2">
            {avgRating > 0 ? avgRating.toFixed(1) : '—'}
          </div>
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-600">
            Dari {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 w-12">5 ⭐</span>
            {renderStars(stats?.five_star || 0, totalRatings)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 w-12">4 ⭐</span>
            {renderStars(stats?.four_star || 0, totalRatings)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 w-12">3 ⭐</span>
            {renderStars(stats?.three_star || 0, totalRatings)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 w-12">2 ⭐</span>
            {renderStars(stats?.two_star || 0, totalRatings)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 w-12">1 ⭐</span>
            {renderStars(stats?.one_star || 0, totalRatings)}
          </div>
        </div>
      </div>

      {/* Rate This Project Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-6 w-full px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition cursor-pointer"
        >
          Berikan Rating untuk Proyek Ini
        </button>
      )}

      {/* Rating Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Berikan Rating Anda</h3>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Anda</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Anda</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5 bintang)
            </label>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="cursor-pointer"
                >
                  <svg
                    className={`w-10 h-10 transition ${
                      star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 ? `${rating} bintang` : 'Pilih rating'}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Komentar (opsional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ceritakan pengalaman Anda..."
            />
            <div className="text-sm text-gray-500 mt-1 text-right">
              {comment.length}/500 karakter
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? 'Mengirim...' : 'Kirim Rating'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
