"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

function useLockBodyScroll(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lock]);
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);

  // Закриття по Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const node = (
    <div
      className={css.backdrop}
      onMouseDown={(e) => {
        // клік по підложці — закрити
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden={!open}
    >
      <div
        ref={dialogRef}
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        <div className={css.header}>
          {title ? (
            <h3 id="modal-title" className={css.title}>
              {title}
            </h3>
          ) : (
            <span />
          )}
          <button
            type="button"
            className={css.close}
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <div className={css.body}>{children}</div>
      </div>
    </div>
  );

  // SSR fallback: якщо document недоступний
  if (typeof document === "undefined") return node;

  return createPortal(node, document.body);
}
