"use client";

import { useState } from "react";
import { apiJson } from "./api";
import ImageInput from "./ImageInput";

const ENDPOINT = "/api/admin/menu";

export default function MenuTab({
  menu,
  onChange,
}: {
  menu: any[];
  onChange: () => void;
}) {
  const [catRu, setCatRu] = useState("");
  const [catKk, setCatKk] = useState("");

  const addCategory = async () => {
    if (!catRu && !catKk) return;
    await apiJson(ENDPOINT, "POST", {
      entity: "category",
      action: "create",
      data: { titleRu: catRu, titleKk: catKk },
    });
    setCatRu("");
    setCatKk("");
    onChange();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-medium text-charcoal">Добавить категорию</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="field" placeholder="Название (рус)" value={catRu} onChange={(e) => setCatRu(e.target.value)} />
          <input className="field" placeholder="Название (қаз)" value={catKk} onChange={(e) => setCatKk(e.target.value)} />
        </div>
        <button onClick={addCategory} className="btn-primary mt-4">
          Добавить категорию
        </button>
      </div>

      {menu.map((cat) => (
        <CategoryBlock key={cat.id} cat={cat} onChange={onChange} />
      ))}
    </div>
  );
}

function CategoryBlock({ cat, onChange }: { cat: any; onChange: () => void }) {
  const [titleRu, setTitleRu] = useState(cat.titleRu);
  const [titleKk, setTitleKk] = useState(cat.titleKk);
  const dirty = titleRu !== cat.titleRu || titleKk !== cat.titleKk;

  const saveCat = async () => {
    await apiJson(ENDPOINT, "POST", {
      entity: "category",
      action: "update",
      data: { id: cat.id, titleRu, titleKk },
    });
    onChange();
  };
  const delCat = async () => {
    if (!confirm("Удалить категорию вместе со всеми блюдами?")) return;
    await apiJson(ENDPOINT, "POST", { entity: "category", action: "delete", data: { id: cat.id } });
    onChange();
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-end gap-3 border-b border-charcoal/10 pb-4">
        <div className="flex-1">
          <label className="label">Категория (рус)</label>
          <input className="field" value={titleRu} onChange={(e) => setTitleRu(e.target.value)} />
        </div>
        <div className="flex-1">
          <label className="label">Категория (қаз)</label>
          <input className="field" value={titleKk} onChange={(e) => setTitleKk(e.target.value)} />
        </div>
        {dirty && (
          <button onClick={saveCat} className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white">
            сохранить
          </button>
        )}
        <button onClick={delCat} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
          удалить категорию
        </button>
      </div>

      <div className="space-y-3">
        {cat.items.map((item: any) => (
          <ItemRow key={item.id} item={item} onChange={onChange} />
        ))}
      </div>

      <NewItem categoryId={cat.id} onChange={onChange} />
    </div>
  );
}

function ItemRow({ item, onChange }: { item: any; onChange: () => void }) {
  const [d, setD] = useState({
    titleRu: item.titleRu,
    titleKk: item.titleKk,
    descRu: item.descRu || "",
    descKk: item.descKk || "",
    price: item.price,
    imageUrl: item.imageUrl || "",
    available: item.available,
  });
  const upd = (patch: Partial<typeof d>) => setD((v) => ({ ...v, ...patch }));

  const save = async () => {
    await apiJson(ENDPOINT, "POST", { entity: "item", action: "update", data: { id: item.id, ...d } });
    onChange();
  };
  const del = async () => {
    if (!confirm("Удалить блюдо?")) return;
    await apiJson(ENDPOINT, "POST", { entity: "item", action: "delete", data: { id: item.id } });
    onChange();
  };

  return (
    <div className="rounded-xl bg-sand/40 p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" placeholder="Название (рус)" value={d.titleRu} onChange={(e) => upd({ titleRu: e.target.value })} />
        <input className="field" placeholder="Название (қаз)" value={d.titleKk} onChange={(e) => upd({ titleKk: e.target.value })} />
        <input className="field" placeholder="Описание (рус)" value={d.descRu} onChange={(e) => upd({ descRu: e.target.value })} />
        <input className="field" placeholder="Описание (қаз)" value={d.descKk} onChange={(e) => upd({ descKk: e.target.value })} />
        <input className="field" type="number" placeholder="Цена, ₸" value={d.price} onChange={(e) => upd({ price: Number(e.target.value) })} />
        <label className="flex items-center gap-2 text-sm text-charcoal/70">
          <input type="checkbox" checked={d.available} onChange={(e) => upd({ available: e.target.checked })} />
          показывать на сайте
        </label>
      </div>
      <div className="mt-3">
        <ImageInput value={d.imageUrl} onChange={(url) => upd({ imageUrl: url })} />
      </div>
      <div className="mt-3 flex gap-3">
        <button onClick={save} className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white">
          сохранить
        </button>
        <button onClick={del} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
          удалить
        </button>
      </div>
    </div>
  );
}

function NewItem({ categoryId, onChange }: { categoryId: string; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [titleRu, setTitleRu] = useState("");
  const [titleKk, setTitleKk] = useState("");
  const [price, setPrice] = useState(0);

  const add = async () => {
    if (!titleRu && !titleKk) return;
    await apiJson(ENDPOINT, "POST", {
      entity: "item",
      action: "create",
      data: { categoryId, titleRu, titleKk, price },
    });
    setTitleRu("");
    setTitleKk("");
    setPrice(0);
    setOpen(false);
    onChange();
  };

  if (!open)
    return (
      <button onClick={() => setOpen(true)} className="mt-3 text-sm text-bronze hover:underline">
        + добавить блюдо
      </button>
    );

  return (
    <div className="mt-3 rounded-xl border border-dashed border-charcoal/20 p-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <input className="field" placeholder="Название (рус)" value={titleRu} onChange={(e) => setTitleRu(e.target.value)} />
        <input className="field" placeholder="Название (қаз)" value={titleKk} onChange={(e) => setTitleKk(e.target.value)} />
        <input className="field" type="number" placeholder="Цена, ₸" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
      </div>
      <div className="mt-3 flex gap-3">
        <button onClick={add} className="btn-primary !py-1.5">
          добавить
        </button>
        <button onClick={() => setOpen(false)} className="text-sm text-charcoal/50">
          отмена
        </button>
      </div>
      <p className="mt-2 text-xs text-charcoal/40">Описание и фото можно добавить после создания.</p>
    </div>
  );
}
