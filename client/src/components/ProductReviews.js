
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState('');

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/reviews/product/${productId}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
   
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setMessage('');
      if (!comment.trim()) {
        setMessage('Comment is required.');
        return;
      }

      if (!editingId) {
       
        const res = await axios.post('/reviews', {
          productId,
          rating: Number(rating),
          comment
        });
        setReviews((prev) => [res.data, ...prev]);
      } else {
       
        const res = await axios.put(`/reviews/${editingId}`, {
          rating: Number(rating),
          comment
        });
        setReviews((prev) =>
          prev.map((r) => (r._id === editingId ? res.data : r))
        );
        setEditingId(null);
      }

      setComment('');
      setRating(5);
      setMessage('Review saved successfully.');
    } catch (err) {
      console.error('Error saving review:', err?.response?.data || err.message);
      setMessage('Error saving review. Please try again.');
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setRating(review.rating);
    setComment(review.comment);
    setMessage('');
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err?.response?.data || err.message);
      setMessage('Error deleting review.');
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <section className="product-section">
      <div className="product-section-header">
        <h2 className="section-title">Reviews</h2>
      </div>

      {averageRating && (
        <p className="muted-text" style={{ marginBottom: 8 }}>
          Average rating: {averageRating} / 5 ({reviews.length} review
          {reviews.length !== 1 ? 's' : ''})
        </p>
      )}

      {loading ? (
        <p className="muted-text">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="muted-text">No reviews yet. Be the first to review!</p>
      ) : (
        <div style={{ marginBottom: 16 }}>
          {reviews.map((r) => {
            const isOwner =
              user && r.user && r.user._id && r.user._id === user._id;
            const stars = '★'.repeat(r.rating || 0).padEnd(5, '☆');
            const reviewerName = r.user?.name || 'Anonymous';
            const createdAt = r.createdAt
              ? new Date(r.createdAt).toLocaleDateString()
              : '';

            return (
              <div
                key={r._id}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  padding: '8px 0'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong>{reviewerName}</strong>{' '}
                    <span
                      style={{
                        fontSize: 12,
                        color: '#6b7280',
                        marginLeft: 4
                      }}
                    >
                      {createdAt}
                    </span>
                    <div style={{ fontSize: 14, color: '#f97316' }}>
                      {stars}
                    </div>
                  </div>
                  {isOwner && (
                    <div>
                      <button
                        className="btn"
                        style={{ padding: '2px 8px', marginRight: 4 }}
                        onClick={() => handleEdit(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn"
                        style={{ padding: '2px 8px' }}
                        onClick={() => handleDelete(r._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <p style={{ marginTop: 4, fontSize: 14 }}>{r.comment}</p>
              </div>
            );
          })}
        </div>
      )}

      {user ? (
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: 480, marginTop: 12 }}
        >
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>
            {editingId ? 'Edit your review' : 'Write a review'}
          </h3>

          <label style={{ display: 'block', marginBottom: 8 }}>
            Rating
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              style={{
                width: '100%',
                padding: 8,
                marginTop: 4
              }}
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Terrible</option>
            </select>
          </label>

          <label style={{ display: 'block', marginBottom: 8 }}>
            Comment
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              placeholder="Share your experience with this product..."
            />
          </label>

          {message && (
            <p
              className="muted-text"
              style={{
                marginBottom: 8,
                color: message.includes('successfully') ? '#16a34a' : '#dc2626'
              }}
            >
              {message}
            </p>
          )}

          <button className="btn btn-primary" type="submit">
            {editingId ? 'Update review' : 'Submit review'}
          </button>
        </form>
      ) : (
        <p className="muted-text" style={{ marginTop: 8 }}>
          Please log in to write a review.
        </p>
      )}
    </section>
  );
};

export default ProductReviews;
