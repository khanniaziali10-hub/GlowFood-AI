"use client";

import { useState, useEffect } from "react";
import { PantryItem, PantryCategory, CATEGORY_EMOJIS } from "@/types";
import { guessEmoji, suggestShelfLife } from "@/lib/pantry-utils";
import { X, Save, Calendar, Package } from "lucide-react";

interface AddItemModalProps {
  onClose: () => void;
  onSave: (item: Omit<PantryItem, "id" | "added_date">) => void;
  editingItem?: PantryItem | null;
}

const CATEGORIES: PantryCategory[] = [
  "Dairy", "Produce", "Meat & Seafood", "Grains & Bread",
  "Condiments", "Frozen", "Snacks", "Beverages", "Other",
];

const UNITS = ["pcs", "g", "kg", "ml", "L", "bag", "box", "pack", "loaf", "bottle", "can"];

function defaultExpiry(name: string): string {
  const days = suggestShelfLife(name);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function AddItemModal({ onClose, onSave, editingItem }: AddItemModalProps) {
  const [name, setName] = useState(editingItem?.name ?? "");
  const [category, setCategory] = useState<PantryCategory>(
    (editingItem?.category as PantryCategory) ?? "Other"
  );
  const [quantity, setQuantity] = useState(String(editingItem?.quantity ?? "1"));
  const [unit, setUnit] = useState(editingItem?.unit ?? "pcs");
  const [expiryDate, setExpiryDate] = useState(
    editingItem?.expiry_date ?? defaultExpiry(editingItem?.name ?? "")
  );
  const [notes, setNotes] = useState(editingItem?.notes ?? "");
  const [emoji, setEmoji] = useState(editingItem?.emoji ?? "🥫");

  // Auto-guess emoji and expiry when name changes
  useEffect(() => {
    if (name && !editingItem) {
      setEmoji(guessEmoji(name));
      setExpiryDate(defaultExpiry(name));
    }
  }, [name, editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !expiryDate) return;
    onSave({
      name: name.trim(),
      category,
      quantity: parseFloat(quantity) || 1,
      unit,
      expiry_date: expiryDate,
      notes: notes.trim(),
      emoji,
    });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1.5px solid rgba(200,160,230,0.25)",
    background: "rgba(255,255,255,0.7)",
    color: "#3d2c3d",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#7c4e8a",
    marginBottom: "5px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(61,44,61,0.4)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 animate-scaleIn"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 24px 60px rgba(120,80,160,0.25), 0 0 0 1px rgba(255,255,255,0.8)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#3d2c3d" }}>
              {editingItem ? "Edit Item" : "Add to Pantry"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#9b8aa0" }}>
              {editingItem ? "Update your item details" : "Log a new food item"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:scale-110 transition-transform"
            style={{ background: "rgba(200,160,230,0.12)", color: "#9b72cf" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji + Name row */}
          <div className="flex gap-3">
            <div>
              <label style={labelStyle}>Icon</label>
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                style={{ ...inputStyle, width: "60px", textAlign: "center", fontSize: "1.4rem", padding: "6px" }}
              />
            </div>
            <div className="flex-1">
              <label style={labelStyle}>Item Name *</label>
              <input
                required
                placeholder="e.g. Whole Milk"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Quantity + Unit */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label style={labelStyle}>Quantity</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div className="flex-1">
              <label style={labelStyle}>Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={inputStyle}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PantryCategory)}
              style={inputStyle}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_EMOJIS[c]} {c}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry Date */}
          <div>
            <label style={labelStyle}>
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                Expiry Date *
              </span>
            </label>
            <input
              required
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes (optional)</label>
            <input
              placeholder="e.g. Opened, store in fridge..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{
                background: "rgba(200,160,230,0.1)",
                color: "#9b72cf",
                border: "1px solid rgba(200,160,230,0.25)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 glow-button text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Save size={15} />
              {editingItem ? "Update" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
