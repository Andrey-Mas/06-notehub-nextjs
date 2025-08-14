// app/notes/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "../lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["notes", { query: undefined, page: 1, limit: 12 }],
    queryFn: () => fetchNotes({ page: 1, limit: 12 }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
