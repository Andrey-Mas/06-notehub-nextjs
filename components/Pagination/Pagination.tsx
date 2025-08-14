"use client";

import css from "./Pagination.module.css";

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (next: number) => void;
}) {
  if (totalPages <= 1) return null;

  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <ul className={css.pagination} aria-label="Pagination">
      <li>
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          Prev
        </button>
      </li>

      {pages.map((p) => (
        <li key={p} className={p === page ? css.active : undefined}>
          <button
            type="button"
            onClick={() => go(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        </li>
      ))}

      <li>
        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </li>
    </ul>
  );
}
