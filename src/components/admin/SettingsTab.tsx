"use client";

import { useState } from "react";
import { apiJson } from "./api";
import ImageInput from "./ImageInput";

type Field = { key: string; label: string; type?: "text" | "textarea" | "image"; hint?: string };
type Group = { title: string; fields: Field[] };

const GROUPS: Group[] = [
  {
    title: "Контакты",
    fields: [
      { key: "whatsapp_phone", label: "WhatsApp (только цифры, формат 7700…)", hint: "Например: 77001234567 — без + и пробелов" },
      { key: "instagram_handle", label: "Instagram (логин без @)" },
      { key: "contact_phone_display", label: "Телефон для показа на сайте" },
      { key: "contact_email", label: "Email (необязательно)" },
    ],
  },
  {
    title: "Адрес и карта",
    fields: [
      { key: "address_ru", label: "Адрес (рус)" },
      { key: "address_kk", label: "Адрес (қаз)" },
      { key: "map_lat", label: "Широта (latitude)", hint: "Из Google Maps / 2GIS, напр. 53.2144" },
      { key: "map_lng", label: "Долгота (longitude)", hint: "напр. 63.6246" },
    ],
  },
  {
    title: "Первый экран (Hero)",
    fields: [
      { key: "hero_image", label: "Фоновое фото", type: "image" },
      { key: "hero_title_ru", label: "Заголовок (рус)" },
      { key: "hero_title_kk", label: "Заголовок (қаз)" },
      { key: "hero_subtitle_ru", label: "Подзаголовок (рус)" },
      { key: "hero_subtitle_kk", label: "Подзаголовок (қаз)" },
    ],
  },
  {
    title: "О коттедже",
    fields: [
      { key: "about_ru", label: "Описание (рус)", type: "textarea" },
      { key: "about_kk", label: "Описание (қаз)", type: "textarea" },
      { key: "capacity_ru", label: "Вместимость (рус)" },
      { key: "capacity_kk", label: "Вместимость (қаз)" },
    ],
  },
  {
    title: "Услуги (каждая с новой строки, формат: Название | Цена | пункт; пункт; пункт)",
    fields: [
      { key: "services_ru", label: "Услуги (рус)", type: "textarea", hint: "Формат: Название | Цена | пункт; пункт. Пункты разделяйте «;». Напр.: Гостевой дом|16000|Бешбармак; 3 вида салата; Фрукты" },
      { key: "services_kk", label: "Услуги (қаз)", type: "textarea", hint: "Пішімі: Атауы | Бағасы | тармақ; тармақ. Тармақтарды «;» арқылы бөліңіз." },
    ],
  },
  {
    title: "Списки (каждый пункт — с новой строки)",
    fields: [
      { key: "events_ru", label: "Подходит для (рус)", type: "textarea" },
      { key: "events_kk", label: "Подходит для (қаз)", type: "textarea" },
      { key: "amenities_ru", label: "Удобства (рус)", type: "textarea" },
      { key: "amenities_kk", label: "Удобства (қаз)", type: "textarea" },
      { key: "rules_ru", label: "Условия аренды (рус)", type: "textarea" },
      { key: "rules_kk", label: "Условия аренды (қаз)", type: "textarea" },
    ],
  },
];

export default function SettingsTab({
  settings,
  onChange,
}: {
  settings: Record<string, string>;
  onChange: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({ ...settings });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    setBusy(true);
    setSaved(false);
    const entries = GROUPS.flatMap((g) => g.fields).map((f) => ({
      key: f.key,
      value: values[f.key] ?? "",
    }));
    const { ok } = await apiJson("/api/admin/settings", "PUT", { entries });
    setBusy(false);
    if (ok) {
      setSaved(true);
      onChange();
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {GROUPS.map((group) => (
        <div key={group.title} className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-medium text-forest">{group.title}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((f) => (
              <div key={f.key} className={f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : ""}>
                {f.type === "image" ? (
                  <ImageInput label={f.label} value={values[f.key] ?? ""} onChange={(url) => set(f.key, url)} />
                ) : (
                  <>
                    <label className="label">{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea
                        className="field min-h-[110px]"
                        value={values[f.key] ?? ""}
                        onChange={(e) => set(f.key, e.target.value)}
                      />
                    ) : (
                      <input
                        className="field"
                        value={values[f.key] ?? ""}
                        onChange={(e) => set(f.key, e.target.value)}
                      />
                    )}
                  </>
                )}
                {f.hint && <p className="mt-1 text-xs text-charcoal/45">{f.hint}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="fixed inset-x-0 bottom-0 border-t border-charcoal/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-4 px-4 py-3">
          {saved && <span className="text-sm text-green-600">Сохранено ✓</span>}
          <button onClick={save} disabled={busy} className="btn-primary">
            {busy ? "Сохраняем…" : "Сохранить настройки"}
          </button>
        </div>
      </div>
    </div>
  );
}
