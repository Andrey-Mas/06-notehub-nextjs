// types/api.ts
import type { Note } from "./note";

export interface NotesQuery {
  query?: string;
  page?: number;
  limit?: number;
}

export interface NotesResponse {
  notes: Note[];
  total: number;
  page?: number;
  limit?: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: string[];
}
