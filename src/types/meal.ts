export type MealCategory =
  | "corba"
  | "ana-yemek"
  | "etli"
  | "tavuk"
  | "zeytinyagli"
  | "firin"
  | "bakliyat"
  | "makarna-hamur"
  | "pratik";

export interface Meal {
  id: string;
  name: string;
  category: MealCategory;
  prepTimeMinutes?: number;
  ingredients: string[];
  emoji?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export interface CycleState {
  cycleNumber: number;
  remainingMealIds: string[];
  cookedMealIds: string[];
  currentMealId: string | null;
  lastUpdated: string;
}

export const CATEGORY_LABELS: Record<MealCategory, string> = {
  "corba": "Çorba",
  "ana-yemek": "Ana Yemek",
  "etli": "Et Yemeği",
  "tavuk": "Tavuklu",
  "zeytinyagli": "Zeytinyağlı",
  "firin": "Fırın",
  "bakliyat": "Bakliyat",
  "makarna-hamur": "Makarna & Hamur",
  "pratik": "Pratik",
};

export const CATEGORY_EMOJIS: Record<MealCategory, string> = {
  "corba": "🥣",
  "ana-yemek": "🍲",
  "etli": "🥩",
  "tavuk": "🍗",
  "zeytinyagli": "🫒",
  "firin": "🥘",
  "bakliyat": "🫘",
  "makarna-hamur": "🍝",
  "pratik": "🍳",
};

