import Link from "next/link";
import css from "./NoteList.module.css";
import type { Note } from "../../types/note";

interface Props {
  notes?: Note[]; // робимо проп опційним
  onDelete: (id: string) => void;
}

export default function NoteList({ notes = [], onDelete }: Props) {
  // дефолт []
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
                onClick={() => onDelete(n.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
