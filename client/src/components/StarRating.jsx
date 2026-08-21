import React from 'react';

const StarRating = ({ rating = 4.5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="d-flex align-items-center text-warning small" title={`${rating} out of 5 stars`}>
      {[...Array(fullStars)].map((_, i) => (
        <i key={`full-${i}`} className="bi bi-star-fill me-1"></i>
      ))}
      {hasHalfStar && <i className="bi bi-star-half me-1"></i>}
      <span className="ms-1 text-muted" style={{ fontSize: '0.7rem' }}>
        ({rating})
      </span>
    </div>
  );
};

export default StarRating;
