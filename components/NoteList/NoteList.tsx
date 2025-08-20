"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../lib/api";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

export default function NoteList({ notes }: NoteListProps) {
  const qc = useQueryClient();
  const remove = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li key={n.id} className={css.listItem}>
          <h3 className={css.title}>{n.title}</h3>
          <p className={css.content}>{n.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{n.tag ?? "No tag"}</span>
            <div className={css.actions}>
              <Link className={css.link} href={`/notes/${n.id}`}>
                View details
              </Link>
              <button
                className={css.button}
                type="button"
                onClick={() => remove.mutate(n.id)}
                aria-busy={remove.isPending}
              >
                {remove.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
