import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { getCompanyReviews, createCompanyReview } from '../../api/reviews';
import { useAuth } from '../../context/AuthContext';
import { StarRating } from '../StarRating/StarRating';
import './CompanyReviews.css';

export function CompanyReviews({ companyId, onLogin }) {
  const { isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadReviews = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setLoadError('');
    try {
      const data = await getCompanyReviews(companyId);
      setReviews(data.data ?? []);
      setAverageRating(data.averageRating ?? null);
      setRatingsCount(data.ratingsCount ?? 0);
    } catch (error) {
      setLoadError(getErrorMessage(error, 'No pudimos cargar las reviews.'));
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      onLogin?.();
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      const data = await createCompanyReview(companyId, { rating, comment });
      setReviews((current) => [data.review, ...current]);
      setAverageRating(data.averageRating ?? null);
      setRatingsCount(data.ratingsCount ?? 0);
      setComment('');
      setRating(5);
    } catch (error) {
      setFormError(getErrorMessage(error, 'No pudimos enviar tu review.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="company-reviews">
      <div className="company-reviews-header">
        <h3>Reviews {ratingsCount > 0 && `(${ratingsCount})`}</h3>
        {averageRating !== null && <StarRating rating={averageRating} size="md" />}
      </div>

      {isAuthenticated ? (
        <form className="company-reviews-form" onSubmit={handleSubmit}>
          <label>
            Rating
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
          <textarea
            placeholder="Comentario (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {formError && <div className="alert alert-error" role="alert">{formError}</div>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Publicar review'}
          </button>
        </form>
      ) : (
        <p className="company-reviews-login-hint">
          <button type="button" className="btn-link" onClick={onLogin}>Inicia sesión</button> para dejar tu review.
        </p>
      )}

      {loading ? (
        <p>Cargando reviews...</p>
      ) : loadError ? (
        <div className="alert alert-error" role="alert">{loadError}</div>
      ) : reviews.length === 0 ? (
        <p className="company-reviews-empty">Todavía no hay reviews para esta empresa.</p>
      ) : (
        <ul className="company-reviews-list">
          {reviews.map((review) => (
            <li key={review.id}>
              <div className="company-reviews-item-header">
                <strong>{review.user?.username ?? 'Usuario'}</strong>
                <StarRating rating={review.rating} size="sm" />
              </div>
              {review.comment && <p>{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CompanyReviews;