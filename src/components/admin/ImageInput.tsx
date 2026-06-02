"use client";

import { useState } from "react";

// Поле для изображения: загрузка файла (Vercel Blob) ИЛИ вставка ссылки.
export default function ImageInput({
  value,
  onChange,
  label = "Фото",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Не удалось загрузить файл. Используйте ссылку.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Ошибка загрузки. Используйте ссылку.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-16 w-16 rounded-lg object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-sand text-xs text-charcoal/40">
            нет
          </div>
        )}
        <label className="cursor-pointer rounded-lg border border-charcoal/20 px-3 py-2 text-sm hover:bg-sand">
          {uploading ? "Загрузка…" : "Загрузить файл"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
        </label>
      </div>
      <input
        className="field mt-2"
        placeholder="или вставьте ссылку на фото (https://…)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="mt-1 text-xs text-amber-600">{error}</p>}
    </div>
  );
}
