import type { Meal, FullCourseMenu } from "../types/meal";

export function isLegume(meal: Meal): boolean {
  if (meal.category === "bakliyat") return true;
  const lowerName = meal.name.toLowerCase();
  const lowerIngs = meal.ingredients.map((i) => i.toLowerCase());
  const legumeKeywords = ["mercimek", "nohut", "kuru fasulye", "barbunya", "bakla"];

  return (
    legumeKeywords.some((kw) => lowerName.includes(kw)) ||
    legumeKeywords.some((kw) => lowerIngs.some((ing) => ing.includes(kw)))
  );
}

export function isCarbOrDough(meal: Meal): boolean {
  if (meal.category === "makarna-hamur") return true;
  const lowerName = meal.name.toLowerCase();
  const lowerIngs = meal.ingredients.map((i) => i.toLowerCase());
  const carbKeywords = ["makarna", "mantı", "pilav", "börek", "spagetti", "penne"];

  return (
    carbKeywords.some((kw) => lowerName.includes(kw)) ||
    carbKeywords.some((kw) => lowerIngs.some((ing) => ing.includes(kw)))
  );
}

const MAIN_CATEGORIES = ["ana-yemek", "etli", "tavuk", "firin", "bakliyat"] as const;
const SIDE_CATEGORIES = ["zeytinyagli", "makarna-hamur", "pratik"] as const;

function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Türk mutfağı uyum kurallarına göre 4'lü dengeli menü oluşturur:
 * 1. Çorba
 * 2. Ana Yemek (Çorba bakliyatsa ana yemek bakliyat olmamaya özen gösterir)
 * 3. Eşlikçi (Ana yemek makarna/hamursa eşlikçi karbonhidrat yerine sebze/zeytinyağlı olur)
 * 4. Tatlı
 */
export function composeTurkishMenu(
  remainingMeals: Meal[],
  allMeals: Meal[]
): FullCourseMenu {
  const soupPool = remainingMeals.filter((m) => m.category === "corba");
  const fallbackSoupPool = allMeals.filter((m) => m.category === "corba");
  const soup = pickRandom(soupPool.length > 0 ? soupPool : fallbackSoupPool);

  const soupIsLegume = soup ? isLegume(soup) : false;

  // 2. Ana Yemek Seçimi
  const mainPool = remainingMeals.filter((m) =>
    MAIN_CATEGORIES.includes(m.category as (typeof MAIN_CATEGORIES)[number])
  );
  const fallbackMainPool = allMeals.filter((m) =>
    MAIN_CATEGORIES.includes(m.category as (typeof MAIN_CATEGORIES)[number])
  );
  const activeMainPool = mainPool.length > 0 ? mainPool : fallbackMainPool;

  // Bakliyat çakışması kontrolü
  let harmonizedMains = activeMainPool;
  if (soupIsLegume) {
    const nonLegumeMains = activeMainPool.filter((m) => !isLegume(m));
    if (nonLegumeMains.length > 0) {
      harmonizedMains = nonLegumeMains;
    }
  }
  const mainCourse = pickRandom(harmonizedMains);

  // 3. Eşlikçi / Yardımcı Yemek Seçimi
  const sidePool = remainingMeals.filter(
    (m) =>
      SIDE_CATEGORIES.includes(m.category as (typeof SIDE_CATEGORIES)[number]) &&
      m.id !== soup?.id &&
      m.id !== mainCourse?.id
  );
  const fallbackSidePool = allMeals.filter(
    (m) =>
      SIDE_CATEGORIES.includes(m.category as (typeof SIDE_CATEGORIES)[number]) &&
      m.id !== soup?.id &&
      m.id !== mainCourse?.id
  );
  const activeSidePool = sidePool.length > 0 ? sidePool : fallbackSidePool;

  // Karbonhidrat çakışması kontrolü
  let harmonizedSides = activeSidePool;
  if (mainCourse && isCarbOrDough(mainCourse)) {
    const nonCarbSides = activeSidePool.filter((m) => !isCarbOrDough(m));
    if (nonCarbSides.length > 0) {
      harmonizedSides = nonCarbSides;
    }
  }
  const sideDish = pickRandom(harmonizedSides);

  // 4. Tatlı Seçimi
  const dessertPool = remainingMeals.filter((m) => m.category === "tatli");
  const fallbackDessertPool = allMeals.filter((m) => m.category === "tatli");
  const dessert = pickRandom(dessertPool.length > 0 ? dessertPool : fallbackDessertPool);

  return {
    soup,
    mainCourse,
    sideDish,
    dessert,
  };
}

/**
 * Menüdeki tek bir yemeği, diğer mevcut yemeklerin uyumunu bozmadan yeniden seçer.
 */
export function rerollSingleCourse(
  courseKey: keyof FullCourseMenu,
  currentMenu: FullCourseMenu,
  remainingMeals: Meal[],
  allMeals: Meal[]
): Meal | null {
  const currentId = currentMenu[courseKey]?.id;

  if (courseKey === "soup") {
    const pool = remainingMeals.filter((m) => m.category === "corba" && m.id !== currentId);
    const fallback = allMeals.filter((m) => m.category === "corba" && m.id !== currentId);
    return pickRandom(pool.length > 0 ? pool : fallback);
  }

  if (courseKey === "mainCourse") {
    const pool = remainingMeals.filter(
      (m) =>
        MAIN_CATEGORIES.includes(m.category as (typeof MAIN_CATEGORIES)[number]) &&
        m.id !== currentId
    );
    const fallback = allMeals.filter(
      (m) =>
        MAIN_CATEGORIES.includes(m.category as (typeof MAIN_CATEGORIES)[number]) &&
        m.id !== currentId
    );
    const active = pool.length > 0 ? pool : fallback;
    const soupIsLegume = currentMenu.soup ? isLegume(currentMenu.soup) : false;
    let harmonized = active;
    if (soupIsLegume) {
      const nonLegumes = active.filter((m) => !isLegume(m));
      if (nonLegumes.length > 0) harmonized = nonLegumes;
    }
    return pickRandom(harmonized);
  }

  if (courseKey === "sideDish") {
    const pool = remainingMeals.filter(
      (m) =>
        SIDE_CATEGORIES.includes(m.category as (typeof SIDE_CATEGORIES)[number]) &&
        m.id !== currentId &&
        m.id !== currentMenu.soup?.id &&
        m.id !== currentMenu.mainCourse?.id
    );
    const fallback = allMeals.filter(
      (m) =>
        SIDE_CATEGORIES.includes(m.category as (typeof SIDE_CATEGORIES)[number]) &&
        m.id !== currentId &&
        m.id !== currentMenu.soup?.id &&
        m.id !== currentMenu.mainCourse?.id
    );
    const active = pool.length > 0 ? pool : fallback;
    let harmonized = active;
    if (currentMenu.mainCourse && isCarbOrDough(currentMenu.mainCourse)) {
      const nonCarbs = active.filter((m) => !isCarbOrDough(m));
      if (nonCarbs.length > 0) harmonized = nonCarbs;
    }
    return pickRandom(harmonized);
  }

  if (courseKey === "dessert") {
    const pool = remainingMeals.filter((m) => m.category === "tatli" && m.id !== currentId);
    const fallback = allMeals.filter((m) => m.category === "tatli" && m.id !== currentId);
    return pickRandom(pool.length > 0 ? pool : fallback);
  }

  return null;
}

