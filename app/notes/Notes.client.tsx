// app/notes/Notes.client.tsx
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote } from "../lib/api";
import SearchBox from "../components/SearchBox/SearchBox";
import NoteForm from "../components/NoteForm/NoteForm";
import NoteList from "../components/NoteList/NoteList";
import css from "./NotesPage.module.css";
import type { NotesResponse } from "../types/note";

export default function NotesClient() {
  const [query, setQuery] = useState("");
  const qc = useQueryClient();

  // Тягнемо список без параметрів (бекенд віддає до 10 елементів)
  const { data, isLoading, error } = useQuery<NotesResponse>({
    queryKey: ["notes"],
    queryFn: () => fetchNotes(),
    staleTime: 10_000,
  });

  // Клієнтський пошук по title/content/tag
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = data?.notes ?? [];
    if (!q) return list;
    return list.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tag.toLowerCase().includes(q)
    );
  }, [data, query]);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      // за бажанням очищаємо пошук
      // setQuery("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

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
        errorMessage={(createMutation.error as Error | undefined)?.message}
      />

      <NoteList notes={filtered} onDelete={(id) => deleteMutation.mutate(id)} />
    </section>
  );
}
