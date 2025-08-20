"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import css from "./NoteDetails.module.css";

interface NoteDetailsClientProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p className={css.wrapper}>Loading…</p>;
  if (error || !data)
    return <p className={css.wrapper}>Failed to load note.</p>;

  return (
    <main className={css.wrapper}>
      <div className={css.container}>
        <Link className={css.back} href="/notes">
          ← Back to notes
        </Link>
        <h1 className={css.title}>{data.title}</h1>
        <p className={css.content}>{data.content}</p>
        <p className={css.meta}>
          <strong>Tag:</strong> {data.tag}
        </p>
      </div>
    </main>
  );
}
