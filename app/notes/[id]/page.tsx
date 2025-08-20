import Link from "next/link";
import { fetchNoteById } from "../../../lib/api";
import css from "./NoteDetails.module.css";

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return (
    <main className={css.wrapper}>
      <div className={css.container}>
        <Link className={css.back} href="/notes">
          ← Back to notes
        </Link>
        <h1 className={css.title}>{note.title}</h1>
        <p className={css.content}>{note.content}</p>
        <p className={css.meta}>
          <strong>Tag:</strong> {note.tag}
        </p>
      </div>
    </main>
  );
}
