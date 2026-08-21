import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="d-flex justify-content-center mt-5">
      <ul className="pagination pagination-dark mb-0 gap-1">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link bg-dark text-light border-secondary"
            onClick={() => onPageChange(currentPage - 1)}
          >
            &laquo; Prev
          </button>
        </li>

        {pages.map((p) => (
          <li key={p} className={`page-item ${currentPage === p ? 'active' : ''}`}>
            <button
              className={`page-link ${currentPage === p ? 'bg-gold text-dark border-gold fw-bold' : 'bg-dark text-light border-secondary'}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link bg-dark text-light border-secondary"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
