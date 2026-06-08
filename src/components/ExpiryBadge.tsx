"use client";

import { ExpiryStatus } from "@/types";
import { expiryLabel, getExpiryStatus } from "@/lib/pantry-utils";

interface ExpiryBadgeProps {
  days: number;
  compact?: boolean;
}

const STATUS_CONFIG: Record<
  ExpiryStatus,
  { bg: string; text: string; border: string; icon: string }
> = {
  expired: {
    bg: "rgba(239,68,68,0.12)",
    text: "#dc2626",
    border: "rgba(239,68,68,0.35)",
    icon: "💀",
  },
  danger: {
    bg: "rgba(249,115,22,0.12)",
    text: "#ea580c",
    border: "rgba(249,115,22,0.35)",
    icon: "🔥",
  },
  warning: {
    bg: "rgba(234,179,8,0.12)",
    text: "#ca8a04",
    border: "rgba(234,179,8,0.35)",
    icon: "⚠️",
  },
  safe: {
    bg: "rgba(34,197,94,0.1)",
    text: "#16a34a",
    border: "rgba(34,197,94,0.2)",
    icon: "✅",
  },
};

export default function ExpiryBadge({ days, compact = false }: ExpiryBadgeProps) {
  const status = getExpiryStatus(days);
  const cfg = STATUS_CONFIG[status];
  const label = expiryLabel(days);

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-semibold"
      style={{
        background: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}`,
        fontSize: compact ? "0.65rem" : "0.72rem",
        padding: compact ? "2px 7px" : "3px 10px",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: compact ? "0.6rem" : "0.7rem" }}>{cfg.icon}</span>
      {label}
    </span>
  );
}
