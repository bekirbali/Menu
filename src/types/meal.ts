export type MealCategory =
  | "corba"
  | "ana-yemek"
  | "etli"
  | "tavuk"
  | "zeytinyagli"
  | "firin"
  | "bakliyat"
  | "makarna-hamur"
  | "pratik"
  | "tatli";

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

export interface FullCourseMenu {
  soup: Meal | null;
  mainCourse: Meal | null;
  sideDish: Meal | null;
  dessert: Meal | null;
}

export interface CuratedMenu {
  id: string;
  name: string;
  soup: string;
  mainDish: string;
  sideDish: string;
  dessert: string;
  isCustom?: boolean;
  createdAt?: string;
}

export type WheelFilterCategory =
  | "all"
  | "corba"
  | "ana-yemek"
  | "zeytinyagli"
  | "tatli"
  | "custom";

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
  "tatli": "Tatlı",
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
  "tatli": "🍮",
};

