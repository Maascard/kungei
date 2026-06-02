"use client";

import { useState } from "react";
import { apiJson } from "./api";
import ImageInput from "./ImageInput";

export default function GalleryTab({
  gallery,
  onChange,
}: {
  gallery: any[];
  onChange: () => void;
}) {
  const [url, setUrl] = useState("");
  const [captionRu, setCaptionRu] = useState("");
  const [captionKk, setCaptionKk] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!url) return;
    setBusy(true);
    await apiJson("/api/admin/gallery", "POST", { url, captionRu, captionKk });
    setBusy(false);
    setUrl("");
    setCaptionRu("");
    setCaptionKk("");
    onChange();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить фото?")) return;
    await apiJson("/api/admin/gallery", "DELETE", { id });
    onChange();
  };

  const saveCaption = async (id: string, ru: string, kk: string) => {
    await apiJson("/api/admin/gallery", "PATCH", { id, captionRu: ru, captionKk: kk });
    onChange();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-medium text-charcoal">Добавить фото</h3>
        <ImageInput value={url} onChange={setUrl} />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input className="field" placeholder="Подпись (рус)" value={captionRu} onChange={(e) => setCaptionRu(e.target.value)} />
          <input className="field" placeholder="Подпись (қаз)" value={captionKk} onChange={(e) => setCaptionKk(e.target.value)} />
        </div>
        <button onClick={add} disabled={busy || !url} className="btn-primary mt-4">
          {busy ? "Добавляем…" : "Добавить в галерею"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.map((img) => (
          <GalleryCard key={img.id} img={img} onDelete={() => remove(img.id)} onSave={saveCaption} />
        ))}
      </div>
    </div>
  );
}

function GalleryCard({
  img,
  onDelete,
  onSave,
}: {
  img: any;
  onDelete: () => void;
  onSave: (id: string, ru: string, kk: string) => void;
}) {
  const [ru, setRu] = useState(img.captionRu || "");
  const [kk, setKk] = useState(img.captionKk || "");
  const dirty = ru !== (img.captionRu || "") || kk !== (img.captionKk || "");

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.url} alt="" className="h-32 w-full object-cover" />
      <div className="space-y-2 p-3">
        <input className="field !py-1.5 text-sm" value={ru} onChange={(e) => setRu(e.target.value)} placeholder="рус" />
        <input className="field !py-1.5 text-sm" value={kk} onChange={(e) => setKk(e.target.value)} placeholder="қаз" />
        <div className="flex justify-between">
          {dirty ? (
            <button onClick={() => onSave(img.id, ru, kk)} className="text-sm text-green-600 hover:underline">
              сохранить
            </button>
          ) : (
            <span />
          )}
          <button onClick={onDelete} className="text-sm text-red-600 hover:underline">
            удалить
          </button>
        </div>
      </div>
    </div>
  );
}
