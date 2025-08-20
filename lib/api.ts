// lib/api.ts
import axios, { AxiosError } from "axios";
import type { Note } from "../types/note";
import type { NotesResponse, ApiError } from "../types/api";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  },
});

// ⚠️ БЕЗ жодних query/page/limit — бек сам повертає ~10 нотаток
export async function fetchNotes(): Promise<NotesResponse> {
  try {
    const { data } = await api.get<NotesResponse>("/notes");
    return data;
  } catch (err) {
    const e = err as AxiosError<ApiError>;
    const raw = e.response?.data;
    const msg =
      raw?.message ||
      (Array.isArray(raw?.errors) ? raw?.errors.join(", ") : undefined) ||
      e.message ||
      "Failed to fetch notes";
    throw new Error(msg);
  }
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: {
  title: string;
  content: string;
  tag: Note["tag"];
}): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
