export default function Rating({ rating, numReviews, caption }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="rating">
      <div className="rating-stars">
        {stars.map((s) => (
          <i
            key={s}
            className={
              rating >= s
                ? 'fas fa-star star-filled'
                : rating >= s - 0.5
                ? 'fas fa-star-half-alt star-half'
                : 'far fa-star star-empty'
            }
            style={{ fontSize: '0.8rem' }}
          />
        ))}
      </div>
      {numReviews !== undefined && (
        <span className="rating-count">
          {caption || `(${numReviews})`}
        </span>
      )}
    </div>
  );
}
