import './StarRating.css';

export function StarRating({ rating = 0, ratingsCount, size = 'md' }) {
  const rounded = Math.round(rating || 0);

  return (
    <span className={`star-rating star-rating--${size}`} aria-label={`${rating ?? 0} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rounded ? 'star-filled' : 'star-empty'}>
          {n <= rounded ? '★' : '☆'}
        </span>
      ))}
      {typeof ratingsCount === 'number' && (
        <span className="star-rating-count">
          {rating != null ? `${rating} ` : ''}({ratingsCount})
        </span>
      )}
    </span>
  );
}

export default StarRating;