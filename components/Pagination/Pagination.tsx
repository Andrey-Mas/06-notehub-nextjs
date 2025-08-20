// components/Pagination/Pagination.tsx
"use client";

import React from "react";
import css from "./Pagination.module.css";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

/**
 * Будує масив сторінок з "…" (еліпсисами).
 * Приклад: [1, '…', 4, 5, 6, '…', 20]
 */
function buildPagesWindow(current: number, total: number, windowSize = 5) {
  const pages: Array<number | "..."> = [];
  const half = Math.floor(windowSize / 2);

  let start = Math.max(1, current - half);
  let end = Math.min(total, current + half);

  // Підганяємо вікно, щоб завжди мати приблизно windowSize елементів,
  // коли це можливо.
  if (end - start + 1 < windowSize) {
    const lack = windowSize - (end - start + 1);
    start = Math.max(1, start - lack);
    end = Math.min(total, end + (windowSize - (end - start + 1)));
  }

  // Ліва частина + еліпсис
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }

  // Середина (вікно)
  for (let p = start; p <= end; p += 1) {
    pages.push(p);
  }

  // Права частина + еліпсис
  if (end < total) {
    if (end < total - 1) pages.push("...");
    pages.push(total);
  }

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (!totalPages || totalPages <= 1) return null;

  const goTo = (page: number) => {
    if (isLoading) return;
    const safe = Math.min(Math.max(page, 1), totalPages);
    if (safe !== currentPage) onPageChange(safe);
  };

  const pages = buildPagesWindow(currentPage, totalPages, 5);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <nav
      className={css.pagination}
      aria-label="Notes pagination"
      role="navigation"
    >
      <ul className={css.list}>
        {/* Prev */}
        <li className={css.item}>
          <button
            type="button"
            className={css.button}
            onClick={() => goTo(currentPage - 1)}
            disabled={isFirst || isLoading}
            aria-label="Previous page"
          >
            ← Prev
          </button>
        </li>

        {/* Numbers + ellipses */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <li key={`dots-${idx}`} className={css.item}>
              <span className={css.ellipsis} aria-hidden>
                …
              </span>
            </li>
          ) : (
            <li key={p} className={css.item}>
              <button
                type="button"
                className={`${css.button} ${
                  p === currentPage ? css.active : ""
                }`}
                onClick={() => goTo(p)}
                aria-current={p === currentPage ? "page" : undefined}
                disabled={isLoading}
              >
                {p}
              </button>
            </li>
          )
        )}

        {/* Next */}
        <li className={css.item}>
          <button
            type="button"
            className={css.button}
            onClick={() => goTo(currentPage + 1)}
            disabled={isLast || isLoading}
            aria-label="Next page"
          >
            Next →
          </button>
        </li>
      </ul>
    </nav>
  );
}
