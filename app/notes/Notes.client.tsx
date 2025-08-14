// app/notes/Notes.client.tsx
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote } from "../../lib/api";
import SearchBox from "../../components/SearchBox/SearchBox";
import NoteForm from "../../components/NoteForm/NoteForm";
import NoteList from "../../components/NoteList/NoteList";
import css from "./NotesPage.module.css";
import type { NotesResponse } from "../../types/note";

export default function NotesClient() {
  const [query, setQuery] = useState("");
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery<NotesResponse>({
    queryKey: ["notes"],
    queryFn: () => fetchNotes(),
    staleTime: 10_000,
  });

  // client-side пошук по title/content/tag (tag може бути undefined!)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = data?.notes ?? [];
    if (!q) return list;

    return list.filter((n) => {
      const inTitle = n.title.toLowerCase().includes(q);
      const inContent = n.content.toLowerCase().includes(q);
      const inTag = (n.tag?.toLowerCase() ?? "").includes(q);
      return inTitle || inContent || inTag;
    });
  }, [data, query]);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      // за потреби можна очищати пошук:
      // setQuery("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  const createErrorMessage =
    createMutation.error instanceof Error
      ? createMutation.error.message
      : undefined;

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <section className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={query} onChange={setQuery} />
      </div>

      <NoteForm
        onSubmit={(payload) => createMutation.mutate(payload)}
        isSubmitting={createMutation.isPending}
        errorMessage={createErrorMessage}
      />

      <NoteList notes={filtered} onDelete={(id) => deleteMutation.mutate(id)} />
    </section>
  );
}
