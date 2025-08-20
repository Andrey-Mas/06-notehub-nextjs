"use client";
import { useEffect, useState } from "react";
import css from "./SearchBox.module.css";

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
}

export default function SearchBox({
  value,
  onChange,
  delay = 300,
}: SearchBoxProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange(local), delay);
    return () => clearTimeout(t);
  }, [local, delay, onChange]);

  return (
    <input
      className={css.input}
      placeholder="Search notes…"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
    />
  );
}
