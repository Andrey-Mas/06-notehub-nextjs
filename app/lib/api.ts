// lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { Note, NotesResponse } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN ?? "";
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ⚠️ Без query-параметрів — так уникаємо 400 від бекенду
export const fetchNotes = async (): Promise<NotesResponse> => {
  try {
    const { data } = await api.get<NotesResponse>("/notes");
    return data;
  } catch (e) {
    const err = e as AxiosError;
    console.error("[API Error][GET /notes]", {
      status: err.response?.status,
      data: err.response?.data,
      params: undefined,
    });
    throw err;
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

// title ≥ 3, content ≥ 5, tag обов’язковий: "Work" | "Personal" | "Shopping" | "Other"
export const createNote = async (
  payload: Pick<Note, "title" | "content" | "tag">
): Promise<Note> => {
  try {
    const { data } = await api.post<Note>("/notes", payload);
    return data;
  } catch (e) {
    const err = e as AxiosError;
    console.error("[API Error][POST /notes]", {
      status: err.response?.status,
      data: err.response?.data,
    });
    throw err;
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};
