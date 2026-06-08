import { PantryItem, ExpiryStatus } from "@/types";

/** Returns how many days until expiry (negative = already expired) */
export function daysUntilExpiry(expiryDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Classifies an item's urgency */
export function getExpiryStatus(days: number): ExpiryStatus {
  if (days < 0) return "expired";
  if (days <= 2) return "danger";
  if (days <= 7) return "warning";
  return "safe";
}

/** Human-readable expiry label */
export function expiryLabel(days: number): string {
  if (days < 0) return `Expired ${Math.abs(days)}d ago`;
  if (days === 0) return "Expires today!";
  if (days === 1) return "Expires tomorrow!";
  if (days <= 7) return `${days} days left`;
  return `${days} days left`;
}

/** Sorts items: expired → danger → warning → safe */
export function sortByExpiry(items: PantryItem[]): PantryItem[] {
  return [...items].sort((a, b) => {
    const da = daysUntilExpiry(a.expiry_date);
    const db = daysUntilExpiry(b.expiry_date);
    return da - db;
  });
}

/** Filter items expiring within N days */
export function getUrgentItems(items: PantryItem[], withinDays = 3): PantryItem[] {
  return items.filter((item) => {
    const d = daysUntilExpiry(item.expiry_date);
    return d >= 0 && d <= withinDays;
  });
}

/** Guess emoji from item name */
export function guessEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("milk") || n.includes("dairy")) return "🥛";
  if (n.includes("egg")) return "🥚";
  if (n.includes("chicken")) return "🍗";
  if (n.includes("beef") || n.includes("meat")) return "🥩";
  if (n.includes("fish") || n.includes("salmon") || n.includes("tuna")) return "🐟";
  if (n.includes("bread")) return "🍞";
  if (n.includes("apple")) return "🍎";
  if (n.includes("banana")) return "🍌";
  if (n.includes("orange")) return "🍊";
  if (n.includes("berry") || n.includes("strawberry")) return "🍓";
  if (n.includes("avocado")) return "🥑";
  if (n.includes("tomato")) return "🍅";
  if (n.includes("lettuce") || n.includes("spinach") || n.includes("greens")) return "🥬";
  if (n.includes("carrot")) return "🥕";
  if (n.includes("cheese")) return "🧀";
  if (n.includes("yogurt")) return "🫙";
  if (n.includes("butter")) return "🧈";
  if (n.includes("juice")) return "🧃";
  if (n.includes("water")) return "💧";
  if (n.includes("pasta") || n.includes("noodle")) return "🍝";
  if (n.includes("rice")) return "🍚";
  if (n.includes("lemon")) return "🍋";
  if (n.includes("grape")) return "🍇";
  if (n.includes("mushroom")) return "🍄";
  if (n.includes("pepper")) return "🌶️";
  return "🥫";
}

/** Suggest shelf life in days for a given food name */
export function suggestShelfLife(name: string): number {
  const n = name.toLowerCase();
  if (n.includes("milk")) return 7;
  if (n.includes("egg")) return 21;
  if (n.includes("chicken") || n.includes("fish")) return 2;
  if (n.includes("beef") || n.includes("pork")) return 3;
  if (n.includes("cheese")) return 14;
  if (n.includes("yogurt")) return 14;
  if (n.includes("butter")) return 30;
  if (n.includes("bread")) return 7;
  if (n.includes("spinach") || n.includes("lettuce")) return 5;
  if (n.includes("berry")) return 5;
  if (n.includes("banana")) return 7;
  if (n.includes("apple")) return 30;
  if (n.includes("tomato")) return 7;
  if (n.includes("carrot")) return 14;
  return 7;
}
