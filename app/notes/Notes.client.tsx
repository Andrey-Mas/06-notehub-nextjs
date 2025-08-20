// app/notes/Notes.client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchNotes, createNote, deleteNote } from "../../lib/api";
import SearchBox from "../../components/SearchBox/SearchBox";
import NoteForm from "../../components/NoteForm/NoteForm";
import NoteList from "../../components/NoteList/NoteList";
import Modal from "../../components/Modal/Modal";
import Pagination from "../../components/Pagination/Pagination";

import css from "./NotesPage.module.css";
import type { NotesResponse } from "../../types/api";

// простий дебаунс
function useDebouncedValue<T>(value: T, delay = 300) {
  const [v, setV] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

interface NotesClientProps {
  initialData: NotesResponse;
}

export default function NotesClient({ initialData }: NotesClientProps) {
  const qc = useQueryClient();

  // пошук (з 1-ї літери) + модалка + пагінація (клієнтська)
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const [page, setPage] = useState(1);
  const PER_PAGE = 12; // скільки карток показуємо на сторінці

  const [open, setOpen] = useState(false);

  // тягнемо БЕЗ параметрів — API повертає ~10 нотаток
  const { data, isLoading, isFetching, error } = useQuery<NotesResponse>({
    queryKey: ["notes"],
    queryFn: () => fetchNotes(),
    initialData,
    staleTime: 10_000,
    refetchOnMount: false,
  });

  // створення
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      setOpen(false);
    },
  });

  // видалення
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  // фільтрація з 1-ї літери на клієнті
  const all = data?.notes ?? [];
  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tag ?? "").toLowerCase().includes(q)
    );
  }, [all, debouncedQuery]);

  // коли міняється пошук — повертаємось на 1 сторінку
  useEffect(() => setPage(1), [debouncedQuery]);

  // клієнтська пагінація
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const currentSlice = filtered.slice(start, start + PER_PAGE);

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <section className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={query} onChange={setQuery} />
        <button className={css.button} onClick={() => setOpen(true)}>
          + New note
        </button>
      </div>

      <NoteList
        notes={currentSlice}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      {/* <Pagination
        currentPage={safePage}
        totalItems={totalItems}
        perPage={PER_PAGE}
        onPageChange={setPage}
        isLoading={isFetching}
      /> */}
      <Pagination
        currentPage={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        isLoading={isFetching}
      />

      <Modal open={open} onClose={() => setOpen(false)}>
        <NoteForm
          onSubmit={(payload) => createMutation.mutate(payload)}
          isSubmitting={createMutation.isPending}
          errorMessage={(createMutation.error as Error | undefined)?.message}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </section>
  );
}
