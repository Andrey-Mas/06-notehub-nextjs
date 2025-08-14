// Список дозволених тегів від бекенду (перша літера велика)
export const TAGS = ["Work", "Personal", "Shopping"] as const;
export type Tag = (typeof TAGS)[number];

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  createdAt?: string;
}

export interface NotesResponse {
  notes: Note[];
}

export interface NotesQueryParams {
  query?: string;
}
