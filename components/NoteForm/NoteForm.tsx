"use client";
import { useMemo, useState } from "react";
import css from "./NoteForm.module.css";
import { TAGS, type Tag } from "../../types/note";

export default function NoteForm({
  onSubmit,
  isSubmitting = false,
  errorMessage,
}: {
  onSubmit: (payload: { title: string; content: string; tag: Tag }) => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<Tag | "">("");

  const canSubmit = useMemo(
    () =>
      title.trim().length >= 3 &&
      content.trim().length >= 5 &&
      tag !== "" &&
      !isSubmitting,
    [title, content, tag, isSubmitting]
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || tag === "") return;
    onSubmit({ title: title.trim(), content: content.trim(), tag });
    setTitle("");
    setContent("");
    setTag("");
  };

  return (
    <form className={css.form} onSubmit={submit} aria-busy={isSubmitting}>
      <label className={css.formGroup}>
        Title
        <input
          className={css.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </label>

      <label className={css.formGroup}>
        Content
        <textarea
          className={css.textarea}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
      </label>

      <label className={css.formGroup}>
        Tag
        <select
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value as Tag | "")}
          disabled={isSubmitting}
        >
          <option value="">Select tag…</option>
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <div className={css.actions}>
        <button
          className={css.submitButton}
          type="submit"
          disabled={!canSubmit}
        >
          {isSubmitting ? "Creating…" : "Create"}
        </button>
        <button
          className={css.cancelButton}
          type="button"
          onClick={() => {
            setTitle("");
            setContent("");
            setTag("");
          }}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>

      {!title.trim() || !content.trim() || tag === "" ? (
        <p className={css.error}>Title ≥ 3, Content ≥ 5, and select a Tag.</p>
      ) : null}

      {errorMessage && <p className={css.error}>{errorMessage}</p>}
    </form>
  );
}
