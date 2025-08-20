// types/note.ts
export const TAGS = [
  "Work",
  "Personal",
  "Shopping",
  "Todo",
  "Meeting",
] as const;
export type Tag = (typeof TAGS)[number];

export interface Note {
  id: string;
  title: string;
  content: string;
  tag?: Tag;
  createdAt: string;
  updatedAt: string;
}
