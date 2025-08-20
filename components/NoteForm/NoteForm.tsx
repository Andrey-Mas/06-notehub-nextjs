"use client";
import { useState } from "react";
import css from "./NoteForm.module.css";
import { TAGS, type Tag } from "../../types/note"; // ✅ ІМПОРТ масиву та типу

export interface NoteFormProps {
  onSubmit: (payload: {
    title: string;
    content: string;
    tag: "Work" | "Personal" | "Shopping" | "Todo" | "Meeting";
  }) => void;
  isSubmitting: boolean;
  errorMessage?: string;
  onCancel?: () => void; // опціонально
}

export default function NoteForm({
  onSubmit,
  isSubmitting,
  errorMessage,
  onCancel,
}: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // "" означає, що тег ще не обрано
  const [tag, setTag] = useState<Tag | "">("");

  const validTitle = title.trim().length >= 3;
  const validContent = content.trim().length >= 5;
  const validTag = tag !== "";

  const canSubmit = validTitle && validContent && validTag && !isSubmitting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      tag: tag as Tag, // тут гарантовано не "", тобто це Tag
    });

    setTitle("");
    setContent("");
    setTag("");
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setTag("");
    onCancel?.(); // викликаємо, якщо передано
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label>Title</label>
        <input
          className={css.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        {!validTitle && <span className={css.error}>Title ≥ 3 chars.</span>}
      </div>

      <div className={css.formGroup}>
        <label>Content</label>
        <textarea
          className={css.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
        {!validContent && <span className={css.error}>Content ≥ 5 chars.</span>}
      </div>

      <div className={css.formGroup}>
        <label>Tag</label>
        <select
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value as Tag | "")}
        >
          <option value="" disabled>
            Select tag…
          </option>
          {TAGS.map((t: Tag) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {!validTag && <span className={css.error}>Select a tag.</span>}
      </div>

      {errorMessage && <div className={css.error}>{errorMessage}</div>}

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitButton}
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
        >
          {isSubmitting ? "Creating…" : "Create"}
        </button>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
