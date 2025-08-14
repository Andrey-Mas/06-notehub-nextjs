import Link from "next/link";
import { fetchNoteById } from "../../lib/api";

// у твоїй поточній збірці Next params — Promise, тому чекаємо його
export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const note = await fetchNoteById(id);

  return (
    <main style={{ padding: 24, maxWidth: 880, margin: "0 auto" }}>
      <p>
        <Link href="/notes">← Back to notes</Link>
      </p>

      <h1 style={{ margin: "16px 0" }}>{note.title}</h1>

      <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{note.content}</p>

      <p style={{ marginTop: 16 }}>
        <strong>Tag:</strong> {note.tag ?? "No tag"}
      </p>
    </main>
  );
}
