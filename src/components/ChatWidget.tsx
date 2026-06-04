"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatWidget({
  dict,
  waLink,
}: {
  dict: Dictionary;
  waLink: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: dict.chat.greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const send = async (textArg?: string) => {
    const text = (textArg ?? input).trim();
    if (!text || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, text }];
    setMessages(next);
    setLoading(true);
    try {
      // В API уходит вся переписка без приветствия (оно только для показа)
      const payload = next.slice(1).map((m) => ({ role: m.role, text: m.text }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      const data = await res.json().catch(() => ({}));
      const reply = data.reply || dict.chat.error;
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: dict.chat.error }]);
    } finally {
      setLoading(false);
    }
  };

  const goBooking = () => {
    setOpen(false);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  const showStarters = messages.length === 1 && !loading;

  return (
    <>
      {/* Кнопка открытия — слева внизу */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={dict.chat.title}
        className={`fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-forest py-3 pl-3 pr-4 text-cream shadow-soft transition hover:scale-105 ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <ChatIcon />
        <span className="hidden text-sm font-medium sm:inline">{dict.chat.open}</span>
        <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-clay" />
        </span>
      </button>

      {/* Окно чата */}
      {open && (
        <div className="fixed inset-x-3 bottom-3 z-50 mx-auto flex h-[72vh] max-w-sm flex-col overflow-hidden rounded-2xl bg-cream shadow-soft sm:inset-x-auto sm:left-5 sm:mx-0 sm:w-[23rem]">
          {/* Заголовок */}
          <div className="flex items-center justify-between bg-forest px-4 py-3 text-cream">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/15">
                <ChatIcon />
              </span>
              <div>
                <div className="font-display text-base leading-tight">{dict.chat.title}</div>
                <div className="text-xs text-cream/70">{dict.chat.subtitle}</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="close" className="text-cream/80 hover:text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Сообщения */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${
                    m.role === "user"
                      ? "rounded-br-sm bg-forest text-cream"
                      : "rounded-bl-sm bg-white text-charcoal shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
                  <span className="flex gap-1">
                    <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
                  </span>
                </div>
              </div>
            )}

            {showStarters && (
              <div className="flex flex-wrap gap-2 pt-1">
                {dict.chat.starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-forest/30 bg-white px-3 py-1.5 text-xs text-forest transition hover:bg-forest hover:text-cream"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Быстрые действия */}
          <div className="flex gap-2 border-t border-charcoal/10 px-3 pt-2">
            <button onClick={goBooking} className="flex-1 rounded-full bg-bronze/15 py-1.5 text-xs font-medium text-bronze hover:bg-bronze/25">
              {dict.chat.toBooking}
            </button>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-full bg-[#25D366]/15 py-1.5 text-center text-xs font-medium text-[#128C4B] hover:bg-[#25D366]/25">
              {dict.chat.toWhatsapp}
            </a>
          </div>

          {/* Ввод */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.chat.placeholder}
              className="flex-1 rounded-full border border-charcoal/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-bronze"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label={dict.chat.send}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-cream transition hover:bg-moss disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 12l16-8-6 16-3-7-7-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.5 12h7M8.5 8.5h7M8.5 15.5h4" />
    </svg>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="inline-block h-2 w-2 animate-bounce rounded-full bg-charcoal/40"
      style={{ animationDelay: delay }}
    />
  );
}
