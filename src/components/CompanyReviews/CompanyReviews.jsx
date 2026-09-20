import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import {
  getCompanyReviews,
  createCompanyReview,
} from '../../api/reviews';
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
    } 
    catch (error) {
      setLoadError(
        getErrorMessage(error, 'No pudimos cargar las reviews.')
      );
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
      const data = await createCompanyReview(companyId, {
        rating,
        comment,
      });

      setReviews((current) => [data.review, ...current]);
      setAverageRating(data.averageRating ?? null);
      setRatingsCount(data.ratingsCount ?? 0);

      setComment('');
      setRating(5); // Aquí pueden ver en que se están equivocando (Errores y de cada tipo :))
    } catch (error) {
      const status = error.response?.status;

  if (status === 403) {
    setFormError('No tienes permiso para reseñar esta empresa.');
  } else if (status === 409) {
    setFormError('Ya publicaste una reseña para esta empresa.');
  } else if (status === 422) {
    setFormError('La calificación debe estar entre 1 y 5.');
  } else {
    setFormError(getErrorMessage(error, 'No pudimos enviar tu review.'));
  }
} finally { 
      setSubmitting(false);
    } // fin de los errores, de aquí en adelante es codigo que no les va a servir para ver errores.
  };
    return (
      <section className="company-reviews">
        <div className="company-reviews-header">
          <div>
            <span className="company-reviews-label">Opiniones</span>
            <h3>Reviews {ratingsCount > 0 && `(${ratingsCount})`}</h3>
          </div>
    
          {averageRating !== null && (
            <div className="company-reviews-average">
              <StarRating rating={averageRating} size="md" />
              <strong>{Number(averageRating).toFixed(1)}</strong>
            </div>
          )}
        </div>
    
        {isAuthenticated ? (
          <form className="company-reviews-form" onSubmit={handleSubmit}>
            <label>
              Calificación
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} estrellas
                  </option>
                ))}
              </select>
            </label>
    
            <textarea
              placeholder="¿Qué opinas de esta empresa?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
    
            {formError && (
              <div className="alert alert-error">{formError}</div>
            )}
    
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publicando...' : 'Publicar review'}
            </button>
          </form>
        ) : (
          <p className="company-reviews-login-hint">
            <button type="button" className="btn-link" onClick={onLogin}>
              Inicia sesión
            </button>{' '}
            para dejar tu review.
          </p>
        )}
    
        {loading ? (
          <p className="company-reviews-state">Cargando reviews...</p>
        ) : loadError ? (
          <div className="alert alert-error">{loadError}</div>
        ) : reviews.length === 0 ? (
          <p className="company-reviews-state">
            Todavía no hay reviews para esta empresa.
          </p>
        ) : (
          <ul className="company-reviews-list">
            {reviews.map((review) => (
              <li className="company-review" key={review.id}>
                <div className="company-review-header">
                  <strong>{review.user?.username ?? 'Usuario'}</strong>
                  <StarRating rating={review.rating} size="sm" />
                </div>
    
                {review.comment && (
                  <p>{review.comment}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    );}

export default CompanyReviews;