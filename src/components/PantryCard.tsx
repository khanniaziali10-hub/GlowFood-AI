"use client";

import { PantryItem } from "@/types";
import { daysUntilExpiry, getExpiryStatus } from "@/lib/pantry-utils";
import ExpiryBadge from "./ExpiryBadge";
import { Trash2, Edit3, ShoppingBasket } from "lucide-react";

interface PantryCardProps {
  item: PantryItem;
  onDelete: (id: string) => void;
  onEdit: (item: PantryItem) => void;
}

const STATUS_BORDER: Record<string, string> = {
  expired: "rgba(239,68,68,0.4)",
  danger: "rgba(249,115,22,0.35)",
  warning: "rgba(234,179,8,0.3)",
  safe: "rgba(34,197,94,0.2)",
};

export default function PantryCard({ item, onDelete, onEdit }: PantryCardProps) {
  const days = daysUntilExpiry(item.expiry_date);
  const status = getExpiryStatus(days);

  return (
    <div
      className="relative rounded-2xl p-4 transition-all duration-300 group hover:scale-[1.02] hover:shadow-xl"
      style={{
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1.5px solid ${STATUS_BORDER[status]}`,
        boxShadow: "0 4px 20px rgba(180,140,200,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      {/* Danger pulse overlay */}
      {(status === "danger" || status === "expired") && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              status === "expired"
                ? "rgba(239,68,68,0.05)"
                : "rgba(249,115,22,0.05)",
            animation: "pulse-danger 2s ease-in-out infinite",
          }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Emoji icon */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{
            background: "linear-gradient(135deg, #fdf4f4, #f7f0fd)",
            boxShadow: "0 2px 8px rgba(180,140,200,0.15)",
          }}
        >
          {item.emoji}
        </div>

        {/* Item info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              className="font-semibold text-sm truncate"
              style={{ color: "#3d2c3d" }}
            >
              {item.name}
            </h3>
            <ExpiryBadge days={days} compact />
          </div>

          <p className="text-xs mt-0.5" style={{ color: "#9b8aa0" }}>
            {item.quantity} {item.unit} · {item.category}
          </p>

          {item.notes && (
            <p
              className="text-xs mt-1 truncate"
              style={{ color: "#b0a0b5", fontStyle: "italic" }}
            >
              {item.notes}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex items-center justify-end gap-2 mt-3 pt-3"
        style={{ borderTop: "1px solid rgba(180,140,200,0.1)" }}
      >
        <button
          onClick={() => onEdit(item)}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
          style={{
            background: "rgba(200,160,230,0.1)",
            color: "#9b72cf",
            border: "1px solid rgba(200,160,230,0.2)",
          }}
        >
          <Edit3 size={11} />
          Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
          style={{
            background: "rgba(239,68,68,0.08)",
            color: "#dc2626",
            border: "1px solid rgba(239,68,68,0.15)",
          }}
        >
          <Trash2 size={11} />
          Remove
        </button>
      </div>
    </div>
  );
}
