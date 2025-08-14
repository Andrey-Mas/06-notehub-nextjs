"use client";

import { useEffect, useState } from "react";
import css from "./SearchBox.module.css";

export default function SearchBox({
  value,
  onChange,
  delay = 300,
}: {
  value: string;
  onChange: (v: string) => void;
  delay?: number;
}) {
  const [text, setText] = useState(value);

  // синхронізуємо, якщо value змінять ззовні
  useEffect(() => setText(value), [value]);

  // дебаунс оновлення
  useEffect(() => {
    const id = setTimeout(() => onChange(text), delay);
    return () => clearTimeout(id);
  }, [text, delay, onChange]);

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}
