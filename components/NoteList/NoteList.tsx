"use client";
import Link from "next/link";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

export default function NoteList({
  notes,
  onDelete,
}: {
  notes: Note[];
  onDelete: (id: string) => void;
}) {
  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li key={n.id} className={css.listItem}>
          <div>
            <h3 className={css.title}>{n.title}</h3>
            <p className={css.content}>{n.content}</p>
          </div>

          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>

            <div style={{ display: "flex", gap: 8 }}>
              <Link className={css.link} href={`/notes/${n.id}`}>
                View details
              </Link>
              <button className={css.button} onClick={() => onDelete(n.id)}>
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
