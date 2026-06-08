"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import { PantryItem } from "@/types";
import { supabase } from "@/lib/supabase";
import { Brain, TrendingUp, ShoppingCart, Package, Sparkles, Loader, AlertCircle } from "lucide-react";
import Link from "next/link";

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

// Demo data
const DEMO_ITEMS: PantryItem[] = [
  { id: "1", name: "Whole Milk", category: "Dairy", quantity: 1, unit: "L", expiry_date: offsetDate(2), added_date: today(), emoji: "🥛" },
  { id: "2", name: "Spinach", category: "Produce", quantity: 1, unit: "bag", expiry_date: offsetDate(3), added_date: today(), emoji: "🥬" },
  { id: "3", name: "Chicken Breast", category: "Meat & Seafood", quantity: 500, unit: "g", expiry_date: offsetDate(1), added_date: today(), emoji: "🍗" },
  { id: "4", name: "Eggs", category: "Dairy", quantity: 12, unit: "pcs", expiry_date: offsetDate(14), added_date: today(), emoji: "🥚" },
];

function today() { return new Date().toISOString().split("T")[0]; }
function offsetDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

type InsightType = "meal-plan" | "shopping-list" | "storage-tips" | "waste-reduction";

const INSIGHT_CARDS = [
  {
    type: "meal-plan" as InsightType,
    icon: Brain,
    title: "AI Meal Planner",
    desc: "Get a 3-day meal plan optimized for your pantry",
    color: "#9b72cf",
    gradient: "linear-gradient(135deg, #f4b8b8, #e8a8e8)",
  },
  {
    type: "shopping-list" as InsightType,
    icon: ShoppingCart,
    title: "Smart Shopping List",
    desc: "AI suggests what to buy based on your inventory",
    color: "#ea580c",
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
  },
  {
    type: "storage-tips" as InsightType,
    icon: Package,
    title: "Storage Optimization",
    desc: "Expert tips to maximize food freshness",
    color: "#16a34a",
    gradient: "linear-gradient(135deg, #34d399, #10b981)",
  },
  {
    type: "waste-reduction" as InsightType,
    icon: TrendingUp,
    title: "Waste Reduction",
    desc: "Strategies to minimize food waste",
    color: "#0891b2",
    gradient: "linear-gradient(135deg, #22d3ee, #06b6d4)",
  },
];

export default function InsightsPage() {
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<InsightType | null>(null);
  const [insights, setInsights] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Load pantry
  const loadPantry = useCallback(async () => {
    const isConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";
    if (!isConfigured) {
      setPantry(DEMO_ITEMS);
      return;
    }
    try {
      const { data } = await supabase.from("pantry_items").select("*").order("expiry_date");
      if (data) setPantry(data as PantryItem[]);
      else setPantry(DEMO_ITEMS);
    } catch {
      setPantry(DEMO_ITEMS);
    }
  }, []);

  useEffect(() => { loadPantry(); }, [loadPantry]);

  const fetchInsights = async (type: InsightType) => {
    setActiveType(type);
    setLoading(true);
    setError("");
    setInsights("");

    try {
      const res = await fetch("/api/smart-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pantryItems: pantry,
          suggestionType: type,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to fetch insights");

      setInsights(data.suggestions);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      let processed = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>");

      if (line.startsWith("# ")) return <h3 key={i} className="font-extrabold text-lg mt-4 mb-2" style={{ color: "#3d2c3d" }} dangerouslySetInnerHTML={{ __html: processed.replace(/^# /, "") }} />;
      if (line.startsWith("## ")) return <h4 key={i} className="font-bold text-base mt-3 mb-1" style={{ color: "#7c4e8a" }} dangerouslySetInnerHTML={{ __html: processed.replace(/^## /, "") }} />;
      if (line.startsWith("- ") || line.startsWith("• ")) return <li key={i} className="ml-5 text-sm leading-relaxed list-disc" dangerouslySetInnerHTML={{ __html: processed.replace(/^[-•] /, "") }} />;
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen pt-16"
        style={{
          background: "radial-gradient(ellipse at 0% 0%, #f4e0e0 0%, transparent 40%), radial-gradient(ellipse at 100% 100%, #eae0f4 0%, transparent 40%), linear-gradient(135deg, #fdf4f4 0%, #f7f0fd 50%, #fdf8f0 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 pt-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(200,160,230,0.3)",
              }}
            >
              <Sparkles size={14} style={{ color: "#9b72cf" }} />
              <span className="text-xs font-semibold" style={{ color: "#7c4e8a" }}>
                Powered by Groq AI
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "#3d2c3d" }}>
              🧠 AI Insights
            </h1>
            <p className="text-base" style={{ color: "#9b8aa0" }}>
              Get intelligent recommendations based on your {pantry.length} pantry items
            </p>
          </div>

          {/* Insight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {INSIGHT_CARDS.map((card) => (
              <button
                key={card.type}
                onClick={() => fetchInsights(card.type)}
                disabled={loading}
                className="rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: activeType === card.type
                    ? card.gradient
                    : "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(16px)",
                  border: activeType === card.type
                    ? "2px solid rgba(255,255,255,0.8)"
                    : "1.5px solid rgba(200,160,230,0.25)",
                  boxShadow: activeType === card.type
                    ? "0 8px 32px rgba(180,140,200,0.3)"
                    : "0 4px 16px rgba(180,140,200,0.08)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: activeType === card.type ? "rgba(255,255,255,0.3)" : card.gradient,
                    color: activeType === card.type ? "white" : "white",
                  }}
                >
                  <card.icon size={22} />
                </div>
                <h3
                  className="font-bold text-sm mb-1"
                  style={{ color: activeType === card.type ? "white" : "#3d2c3d" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: activeType === card.type ? "rgba(255,255,255,0.9)" : "#9b8aa0" }}
                >
                  {card.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Results Area */}
          {(loading || insights || error) && (
            <div
              className="rounded-3xl p-8"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(20px)",
                border: "1.5px solid rgba(200,160,230,0.25)",
                boxShadow: "0 8px 32px rgba(180,140,200,0.12)",
              }}
            >
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader size={40} className="animate-spin" style={{ color: "#9b72cf" }} />
                  <p className="text-sm font-medium" style={{ color: "#7c4e8a" }}>
                    AI is analyzing your pantry...
                  </p>
                </div>
              )}

              {error && (
                <div
                  className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  <AlertCircle size={20} style={{ color: "#dc2626" }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#dc2626" }}>
                      Error
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#9b8aa0" }}>
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {insights && !loading && (
                <div className="prose prose-sm max-w-none" style={{ color: "#3d2c3d" }}>
                  {renderContent(insights)}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && !insights && !error && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#3d2c3d" }}>
                Select an insight type above
              </h3>
              <p className="text-sm" style={{ color: "#9b8aa0" }}>
                Choose from meal planning, shopping lists, storage tips, or waste reduction
              </p>
            </div>
          )}

          {/* CTA */}
          {pantry.length === 0 && (
            <div
              className="mt-8 rounded-2xl p-6 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(251,191,36,0.08))",
                border: "1.5px solid rgba(249,115,22,0.25)",
              }}
            >
              <p className="text-sm font-medium mb-3" style={{ color: "#7c4e8a" }}>
                Your pantry is empty. Add items to get personalized AI insights!
              </p>
              <Link
                href="/pantry"
                className="glow-button inline-flex text-white font-bold px-6 py-2.5 rounded-xl text-sm items-center gap-2"
              >
                <Package size={16} />
                Go to Pantry
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
