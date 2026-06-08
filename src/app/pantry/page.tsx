"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { PantryItem, PantryCategory } from "@/types";
import { supabase } from "@/lib/supabase";
import { sortByExpiry, getUrgentItems, daysUntilExpiry, getExpiryStatus } from "@/lib/pantry-utils";
import PantryCard from "@/components/PantryCard";
import AddItemModal from "@/components/AddItemModal";
import {
  Plus,
  Camera,
  Search,
  Filter,
  AlertTriangle,
  Package,
  RefreshCw,
  ChefHat,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const QRScanner = dynamic(() => import("@/components/QRScanner"), { ssr: false });

// ── Fallback in-memory data when Supabase isn't configured ──────────────────
const DEMO_ITEMS: PantryItem[] = [
  { id: "1", name: "Whole Milk",     category: "Dairy",          quantity: 1,   unit: "L",    expiry_date: offsetDate(2),  added_date: today(), emoji: "🥛" },
  { id: "2", name: "Greek Yogurt",   category: "Dairy",          quantity: 2,   unit: "pcs",  expiry_date: offsetDate(1),  added_date: today(), emoji: "🫙" },
  { id: "3", name: "Spinach",        category: "Produce",        quantity: 1,   unit: "bag",  expiry_date: offsetDate(3),  added_date: today(), emoji: "🥬" },
  { id: "4", name: "Chicken Breast", category: "Meat & Seafood", quantity: 500, unit: "g",    expiry_date: offsetDate(1),  added_date: today(), emoji: "🍗" },
  { id: "5", name: "Avocados",       category: "Produce",        quantity: 3,   unit: "pcs",  expiry_date: offsetDate(4),  added_date: today(), emoji: "🥑" },
  { id: "6", name: "Mixed Berries",  category: "Produce",        quantity: 1,   unit: "pack", expiry_date: offsetDate(-1), added_date: today(), emoji: "🍓" },
  { id: "7", name: "Cheddar Cheese", category: "Dairy",          quantity: 200, unit: "g",    expiry_date: offsetDate(10), added_date: today(), emoji: "🧀" },
  { id: "8", name: "Sourdough Bread","category": "Grains & Bread",quantity: 1,  unit: "loaf", expiry_date: offsetDate(5),  added_date: today(), emoji: "🍞" },
  { id: "9", name: "Eggs",           category: "Dairy",          quantity: 12,  unit: "pcs",  expiry_date: offsetDate(14), added_date: today(), emoji: "🥚" },
  { id: "10", name: "Salmon Fillet", category: "Meat & Seafood", quantity: 300, unit: "g",    expiry_date: offsetDate(1),  added_date: today(), emoji: "🐟" },
];

function today() {
  return new Date().toISOString().split("T")[0];
}
function offsetDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  );
};

const FILTER_TABS = ["All", "Urgent", "Dairy", "Produce", "Meat & Seafood", "Grains & Bread", "Other"] as const;

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [usingDemo, setUsingDemo] = useState(false);

  // ── Load Items ──────────────────────────────────────────────────────────────
  const loadItems = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      setItems(DEMO_ITEMS);
      setUsingDemo(true);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("pantry_items")
        .select("*")
        .order("expiry_date", { ascending: true });
      if (error) throw error;
      setItems((data as PantryItem[]) ?? []);
    } catch {
      setItems(DEMO_ITEMS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  // ── CRUD ────────────────────────────────────────────────────────────────────
  const handleSave = async (itemData: Omit<PantryItem, "id" | "added_date">) => {
    if (usingDemo) {
      if (editingItem) {
        setItems((prev) =>
          prev.map((it) => (it.id === editingItem.id ? { ...it, ...itemData } : it))
        );
      } else {
        const newItem: PantryItem = {
          ...itemData,
          id: String(Date.now()),
          added_date: today(),
        };
        setItems((prev) => sortByExpiry([...prev, newItem]));
      }
      setShowAddModal(false);
      setEditingItem(null);
      return;
    }

    if (editingItem) {
      await supabase.from("pantry_items").update(itemData).eq("id", editingItem.id);
    } else {
      await supabase.from("pantry_items").insert([{ ...itemData, added_date: today() }]);
    }
    setShowAddModal(false);
    setEditingItem(null);
    loadItems();
  };

  const handleDelete = async (id: string) => {
    if (usingDemo) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      return;
    }
    await supabase.from("pantry_items").delete().eq("id", id);
    loadItems();
  };

  const handleEdit = (item: PantryItem) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleQRResult = (barcode: string) => {
    setShowScanner(false);
    setEditingItem(null);
    setShowAddModal(true);
    // In production, you'd look up the barcode in Open Food Facts API
    console.log("Scanned barcode:", barcode);
  };

  // ── Filtering & search ──────────────────────────────────────────────────────
  const urgentItems = getUrgentItems(items, 2);

  const filteredItems = sortByExpiry(items).filter((item) => {
    const matchSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;
    if (filter === "All") return true;
    if (filter === "Urgent") return daysUntilExpiry(item.expiry_date) <= 2;
    return item.category === filter || (filter === "Other" && !["Dairy", "Produce", "Meat & Seafood", "Grains & Bread"].includes(item.category));
  });

  // ── Stats ───────────────────────────────────────────────────────────────────
  const expiredCount = items.filter((i) => daysUntilExpiry(i.expiry_date) < 0).length;
  const dangerCount = items.filter((i) => {
    const d = daysUntilExpiry(i.expiry_date);
    return d >= 0 && d <= 2;
  }).length;

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen pt-16"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, #f4e0e0 0%, transparent 40%), radial-gradient(ellipse at 100% 100%, #eae0f4 0%, transparent 40%), linear-gradient(135deg, #fdf4f4 0%, #f7f0fd 50%, #fdf8f0 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 pt-8">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "#3d2c3d" }}>
                🌿 My Pantry
              </h1>
              <p className="text-sm mt-1" style={{ color: "#9b8aa0" }}>
                {items.length} items tracked · {urgentItems.length} need attention
                {usingDemo && (
                  <span
                    className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(251,191,36,0.15)", color: "#d97706", border: "1px solid rgba(251,191,36,0.3)" }}
                  >
                    Demo Mode
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowScanner(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1.5px solid rgba(200,160,230,0.35)",
                  color: "#7c4e8a",
                  boxShadow: "0 4px 12px rgba(180,140,200,0.12)",
                }}
              >
                <Camera size={16} />
                Scan
              </button>
              <button
                onClick={() => { setEditingItem(null); setShowAddModal(true); }}
                className="glow-button text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>
          </div>

          {/* ── Urgent Alert Banner ── */}
          {(urgentItems.length > 0 || expiredCount > 0) && (
            <div
              className="rounded-2xl p-4 mb-6 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row"
              style={{
                background: expiredCount > 0
                  ? "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.08))"
                  : "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(234,179,8,0.08))",
                border: expiredCount > 0
                  ? "1.5px solid rgba(239,68,68,0.25)"
                  : "1.5px solid rgba(249,115,22,0.25)",
                boxShadow: "0 4px 16px rgba(239,68,68,0.08)",
              }}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} style={{ color: expiredCount > 0 ? "#dc2626" : "#ea580c" }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#3d2c3d" }}>
                    {expiredCount > 0
                      ? `${expiredCount} item${expiredCount > 1 ? "s" : ""} expired · ${dangerCount} expiring within 48h`
                      : `${dangerCount} item${dangerCount > 1 ? "s" : ""} expiring within 48 hours`}
                  </p>
                  <p className="text-xs" style={{ color: "#9b8aa0" }}>
                    Use them now or ask the AI Chef for recipes
                  </p>
                </div>
              </div>
              <Link
                href="/chat"
                className="glow-button text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap"
              >
                <ChefHat size={14} />
                Ask AI Chef
              </Link>
            </div>
          )}

          {/* ── Stats row ── */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Items",  value: items.length, icon: "📦", color: "#9b72cf" },
              { label: "Expiring Soon", value: dangerCount, icon: "🔥", color: "#ea580c" },
              { label: "Expired",      value: expiredCount, icon: "💀", color: "#dc2626" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(200,160,230,0.2)",
                  boxShadow: "0 4px 16px rgba(180,140,200,0.08)",
                }}
              >
                <div className="text-xl mb-0.5">{s.icon}</div>
                <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: "#9b8aa0" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Search + Filter ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9b8aa0" }} />
              <input
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1.5px solid rgba(200,160,230,0.25)",
                  color: "#3d2c3d",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
            {FILTER_TABS.map((tab) => {
              const active = filter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                  style={{
                    background: active
                      ? "linear-gradient(135deg, #f4b8b8, #b8a8f4)"
                      : "rgba(255,255,255,0.6)",
                    color: active ? "white" : "#7c4e8a",
                    border: active ? "none" : "1px solid rgba(200,160,230,0.25)",
                    boxShadow: active ? "0 4px 12px rgba(200,140,220,0.3)" : "none",
                    transform: active ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  {tab === "Urgent" && "🔥 "}
                  {tab}
                </button>
              );
            })}
          </div>

          {/* ── Grid ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <RefreshCw size={32} className="animate-spin" style={{ color: "#9b72cf" }} />
              <p className="text-sm" style={{ color: "#9b8aa0" }}>Loading your pantry...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="text-5xl">🥗</div>
              <h3 className="text-lg font-bold" style={{ color: "#3d2c3d" }}>
                {search ? "No items match your search" : "Your pantry is empty"}
              </h3>
              <p className="text-sm" style={{ color: "#9b8aa0" }}>
                {search ? "Try a different search term" : "Scan a barcode or add items manually to get started."}
              </p>
              {!search && (
                <button
                  onClick={() => { setEditingItem(null); setShowAddModal(true); }}
                  className="glow-button text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 mt-2"
                >
                  <Plus size={16} />
                  Add First Item
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <PantryCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}

          {/* ── AI Chef CTA ── */}
          {items.length > 0 && (
            <div
              className="mt-12 rounded-3xl p-8 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(244,184,184,0.3), rgba(184,168,244,0.3))",
                border: "1.5px solid rgba(200,160,230,0.3)",
                boxShadow: "0 8px 32px rgba(180,140,200,0.12)",
              }}
            >
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-xl font-extrabold mb-2" style={{ color: "#3d2c3d" }}>
                Let the AI Chef cook for you
              </h3>
              <p className="text-sm mb-5" style={{ color: "#9b8aa0" }}>
                {urgentItems.length > 0
                  ? `You have ${urgentItems.length} item${urgentItems.length > 1 ? "s" : ""} expiring soon. Ask the chef what to make!`
                  : "Ask our AI chef for personalized recipe ideas from your pantry."}
              </p>
              <Link
                href="/chat"
                className="glow-button inline-flex text-white font-bold px-8 py-3 rounded-xl items-center gap-2"
              >
                <Sparkles size={16} />
                Open AI Chef
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {showAddModal && (
        <AddItemModal
          onClose={() => { setShowAddModal(false); setEditingItem(null); }}
          onSave={handleSave}
          editingItem={editingItem}
        />
      )}
      {showScanner && (
        <QRScanner
          onResult={handleQRResult}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  );
}
