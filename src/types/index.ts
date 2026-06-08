export interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry_date: string; // ISO date string YYYY-MM-DD
  added_date: string;
  barcode?: string;
  notes?: string;
  emoji: string;
  days_until_expiry?: number; // computed client-side
}

export type ExpiryStatus = "expired" | "danger" | "warning" | "safe";

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ScanResult {
  barcode: string;
  name?: string;
  category?: string;
  emoji?: string;
}

export type PantryCategory =
  | "Dairy"
  | "Produce"
  | "Meat & Seafood"
  | "Grains & Bread"
  | "Condiments"
  | "Frozen"
  | "Snacks"
  | "Beverages"
  | "Other";

export const CATEGORY_EMOJIS: Record<string, string> = {
  Dairy: "🥛",
  Produce: "🥦",
  "Meat & Seafood": "🥩",
  "Grains & Bread": "🍞",
  Condiments: "🫙",
  Frozen: "🧊",
  Snacks: "🍿",
  Beverages: "🧃",
  Other: "📦",
};

export const FOOD_SHELF_LIFE: Record<string, number> = {
  Milk: 7,
  Eggs: 21,
  Bread: 7,
  Cheese: 14,
  Yogurt: 14,
  Butter: 30,
  Chicken: 2,
  Beef: 3,
  Fish: 2,
  Spinach: 5,
  Lettuce: 7,
  Tomatoes: 7,
  Apples: 30,
  Bananas: 7,
  Berries: 5,
  default: 7,
};
