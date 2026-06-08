"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, PantryItem } from "@/types";
import { supabase } from "@/lib/supabase";
import { sortByExpiry, getUrgentItems } from "@/lib/pantry-utils";
import { Send, Sparkles, ChefHat, RefreshCw, Trash2, Copy, Check } from "lucide-react";

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

// ── Demo pantry for when Supabase isn't configured ──────────────────────────
const DEMO_INVENTORY: PantryItem[] = [
  { id: "1", name: "Whole Milk",     category: "Dairy",          quantity: 1,   unit: "L",    expiry_date: offsetDate(2),  added_date: today(), emoji: "🥛" },
  { id: "2", name: "Spinach",        category: "Produce",        quantity: 1,   unit: "bag",  expiry_date: offsetDate(3),  added_date: today(), emoji: "🥬" },
  { id: "3", name: "Chicken Breast", category: "Meat & Seafood", quantity: 500, unit: "g",    expiry_date: offsetDate(1),  added_date: today(), emoji: "🍗" },
  { id: "4", name: "Avocados",       category: "Produce",        quantity: 3,   unit: "pcs",  expiry_date: offsetDate(4),  added_date: today(), emoji: "🥑" },
  { id: "5", name: "Eggs",           category: "Dairy",          quantity: 12,  unit: "pcs",  expiry_date: offsetDate(14), added_date: today(), emoji: "🥚" },
  { id: "6", name: "Mixed Berries",  category: "Produce",        quantity: 1,   unit: "pack", expiry_date: offsetDate(1),  added_date: today(), emoji: "🍓" },
];

function today() { return new Date().toISOString().split("T")[0]; }
function offsetDate(days: number) {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// ── Quick prompt suggestions ─────────────────────────────────────────────────
const QUICK_PROMPTS = [
  "What should I cook first to avoid waste?",
  "Give me a quick dinner recipe with what I have",
  "Meal prep ideas for this week",
  "Smoothie recipes using my expiring fruit",
  "How do I store these items longer?",
];

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Load pantry context ───────────────────────────────────────────────────
  const loadPantry = useCallback(async () => {
    const isConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";
    if (!isConfigured) {
      setPantry(DEMO_INVENTORY);
      return;
    }
    try {
      const { data } = await supabase.from("pantry_items").select("*").order("expiry_date");
      if (data) setPantry(data as PantryItem[]);
      else setPantry(DEMO_INVENTORY);
    } catch {
      setPantry(DEMO_INVENTORY);
    }
  }, []);

  useEffect(() => { loadPantry(); }, [loadPantry]);

  // ── Welcome message ───────────────────────────────────────────────────────
  useEffect(() => {
    const urgent = getUrgentItems(pantry, 2);
    const welcome = urgent.length > 0
      ? `Hi! 👋 I'm your **GlowFood Chef**.\n\n🚨 I can see you have **${urgent.length} item${urgent.length > 1 ? "s" : ""} expiring soon**: ${urgent.map((i) => `${i.emoji} ${i.name}`).join(", ")}.\n\nWant me to suggest recipes that use these up? Just ask!`
      : `Hi! 👋 I'm your **GlowFood Chef**.\n\nI can see your pantry has **${pantry.length} items**. Ask me anything — recipe ideas, meal plans, or how to best use what you have before it expires! 🌿`;

    if (pantry.length > 0) {
      setMessages([
        {
          id: uid(),
          role: "assistant",
          content: welcome,
          timestamp: new Date(),
        },
      ]);
    }
  }, [pantry]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          pantryItems: sortByExpiry(pantry),
          // Filter out the initial welcome message (first assistant/model message with no prior user message)
          history: messages
            .filter((m, idx) => !((m.role === "assistant" || m.role === "model") && idx === 0))
            .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content })),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "API error");

      const aiMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: data.reply ?? "Sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: `⚠️ **Error:** ${errMsg}\n\nMake sure your **GROQ_API_KEY** is set in \`.env.local\`.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const urgentItems = getUrgentItems(pantry, 2);

  // ── Simple markdown-like renderer ────────────────────────────────────────
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Bold + italic inline
      let processed = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`(.+?)`/g, '<code style="background:rgba(155,114,207,0.15);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:0.85em">$1</code>');

      if (line.startsWith("# ")) return <h3 key={i} className="font-extrabold text-base mt-3 mb-1" style={{ color: "#3d2c3d" }} dangerouslySetInnerHTML={{ __html: processed.replace(/^# /, "") }} />;
      if (line.startsWith("## ")) return <h4 key={i} className="font-bold text-sm mt-2 mb-0.5" style={{ color: "#7c4e8a" }} dangerouslySetInnerHTML={{ __html: processed.replace(/^## /, "") }} />;
      if (line.startsWith("- ") || line.startsWith("• ")) return <li key={i} className="ml-4 text-sm leading-relaxed list-disc" dangerouslySetInnerHTML={{ __html: processed.replace(/^[-•] /, "") }} />;
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <>
      <Navbar />

      <div
        className="flex flex-col min-h-screen pt-16"
        style={{
          background: "radial-gradient(ellipse at 0% 0%, #f4e0e0 0%, transparent 40%), radial-gradient(ellipse at 100% 100%, #eae0f4 0%, transparent 40%), linear-gradient(135deg, #fdf4f4 0%, #f7f0fd 50%, #fdf8f0 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 px-4 sm:px-6 pb-6 pt-6">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                style={{
                  background: "linear-gradient(135deg, #f4b8b8, #e8a8e8, #b8a8f4)",
                  boxShadow: "0 6px 20px rgba(200,140,220,0.4)",
                }}
              >
                🤖
              </div>
              <div>
                <h1 className="font-extrabold text-lg" style={{ color: "#3d2c3d" }}>
                  Waste-Reduction Chef
                </h1>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs" style={{ color: "#9b8aa0" }}>
                    AI Chef · analyzing {pantry.length} pantry items
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMessages([])}
                title="Clear chat"
                className="p-2 rounded-xl hover:scale-110 transition-transform"
                style={{ background: "rgba(200,160,230,0.12)", color: "#9b72cf" }}
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={loadPantry}
                title="Refresh pantry"
                className="p-2 rounded-xl hover:scale-110 transition-transform"
                style={{ background: "rgba(200,160,230,0.12)", color: "#9b72cf" }}
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* ── Urgent items strip ── */}
          {urgentItems.length > 0 && (
            <div
              className="rounded-2xl p-3 mb-4 flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(251,191,36,0.08))",
                border: "1px solid rgba(249,115,22,0.25)",
              }}
            >
              <span className="text-base">🔥</span>
              <p className="text-xs font-medium flex-1" style={{ color: "#7c4e8a" }}>
                <strong>{urgentItems.length}</strong> item{urgentItems.length > 1 ? "s" : ""} expiring soon:{" "}
                {urgentItems.map((i) => `${i.emoji} ${i.name}`).join(", ")}
              </p>
              <button
                onClick={() => sendMessage("What recipes can I make with " + urgentItems.map((i) => i.name).join(", ") + "?")}
                className="text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #f4b8b8, #b8a8f4)", color: "white" }}
              >
                Use these!
              </button>
            </div>
          )}

          {/* ── Chat area ── */}
          <div
            className="flex-1 rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(200,160,230,0.25)",
              boxShadow: "0 8px 40px rgba(180,140,200,0.12)",
              minHeight: "400px",
            }}
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
              {messages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-4">
                  <ChefHat size={48} style={{ color: "#c8a0d8" }} />
                  <p className="text-base font-semibold" style={{ color: "#7c4e8a" }}>
                    Your AI Chef is ready
                  </p>
                  <p className="text-sm" style={{ color: "#9b8aa0" }}>
                    Loading your pantry inventory...
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {(msg.role === "model" || msg.role === "assistant") && (
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-base mr-2 flex-shrink-0 self-end mb-0.5"
                      style={{ background: "linear-gradient(135deg, #f4b8b8, #b8a8f4)" }}
                    >
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] relative group ${msg.role === "user" ? "chat-user" : "chat-ai"}`}
                    style={{ padding: "12px 16px" }}
                  >
                    <div className={msg.role === "user" ? "text-white" : ""}>
                      {renderContent(msg.content)}
                    </div>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span
                        className="text-xs opacity-50"
                        style={{ color: msg.role === "user" ? "white" : "#9b8aa0" }}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {msg.role === "model" && (
                        <button
                          onClick={() => copyMessage(msg.id, msg.content)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy"
                        >
                          {copiedId === msg.id
                            ? <Check size={12} style={{ color: "#16a34a" }} />
                            : <Copy size={12} style={{ color: "#c8a0d8" }} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #f4b8b8, #b8a8f4)" }}
                  >
                    🤖
                  </div>
                  <div
                    className="chat-ai px-5 py-3 flex items-center gap-2"
                    style={{ borderRadius: "18px 18px 18px 4px" }}
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: "#c8a0d8",
                          animation: `float 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && !loading && (
              <div className="px-5 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="text-xs font-medium px-3 py-2 rounded-xl whitespace-nowrap transition-all hover:scale-105"
                    style={{
                      background: "rgba(200,160,230,0.12)",
                      color: "#7c4e8a",
                      border: "1px solid rgba(200,160,230,0.25)",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <div
              className="p-4"
              style={{ borderTop: "1px solid rgba(200,160,230,0.2)" }}
            >
              <div className="flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me what to cook tonight… (Enter to send)"
                  rows={1}
                  disabled={loading}
                  className="flex-1 resize-none rounded-xl px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: "1.5px solid rgba(200,160,230,0.3)",
                    color: "#3d2c3d",
                    outline: "none",
                    maxHeight: "120px",
                    overflowY: "auto",
                  }}
                  onInput={(e) => {
                    const t = e.target as HTMLTextAreaElement;
                    t.style.height = "auto";
                    t.style.height = Math.min(t.scrollHeight, 120) + "px";
                  }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #f4b8b8, #e8a8e8, #b8a8f4)",
                    boxShadow: "0 4px 16px rgba(200,140,220,0.4)",
                  }}
                >
                  <Send size={17} className="text-white" />
                </button>
              </div>
              <p className="text-xs text-center mt-2" style={{ color: "#c8b8d0" }}>
                <Sparkles size={10} className="inline mr-1" />
                Powered by Groq AI · Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
