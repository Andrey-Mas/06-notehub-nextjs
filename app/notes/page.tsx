// app/notes/page.tsx
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "../../lib/api";

export default async function NotesPage() {
  const qc = new QueryClient();

  const initial = await fetchNotes();
  // опційно — прогріти кєш
  qc.setQueryData(["notes"], initial);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient initialData={initial} />
    </HydrationBoundary>
  );
}
