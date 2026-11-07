import { useState, useEffect, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import type { Meal, CycleState } from "../types/meal";
import { DEFAULT_MEALS } from "../data/defaultMeals";

const STORAGE_CYCLE_KEY = "menu_cycle_state_v1";
const STORAGE_CUSTOM_KEY = "menu_custom_meals_v1";

export function useMealCycle() {
  // 1. Kullanıcının sonradan eklediği özel yemekler
  const [customMeals, setCustomMeals] = useState<Meal[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Tüm yemekler havuzu: Varsayılanlar + Özel Yemekler
  const allMeals = useMemo(() => {
    return [...DEFAULT_MEALS, ...customMeals];
  }, [customMeals]);

  // 2. Kalıcı Döngü Durumu
  const [cycleState, setCycleState] = useState<CycleState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CYCLE_KEY);
      if (raw) {
        const parsed: CycleState = JSON.parse(raw);
        // Validasyon: Boş kalmışsa veya geçersizse düzelt
        if (Array.isArray(parsed.remainingMealIds) && Array.isArray(parsed.cookedMealIds)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Döngü durumu okunamadı:", e);
    }

    // İlk kurulum varsayılanı
    const initialIds = DEFAULT_MEALS.map((m) => m.id);
    return {
      cycleNumber: 1,
      remainingMealIds: initialIds,
      cookedMealIds: [],
      currentMealId: initialIds[Math.floor(Math.random() * initialIds.length)],
      lastUpdated: new Date().toISOString(),
    };
  });

  // Custom meals değiştikçe kaydet
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(customMeals));
    } catch (e) {
      console.error("Özel yemekler kaydedilemedi:", e);
    }
  }, [customMeals]);

  // Döngü durumu değiştikçe kaydet
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CYCLE_KEY, JSON.stringify(cycleState));
    } catch (e) {
      console.error("Döngü kaydedilemedi:", e);
    }
  }, [cycleState]);

  // Hızlı erişim için Map
  const mealMap = useMemo(() => {
    const map = new Map<string, Meal>();
    allMeals.forEach((m) => map.set(m.id, m));
    return map;
  }, [allMeals]);

  // Yapılacaklar (Kalan Yemekler)
  const remainingMeals = useMemo(() => {
    return cycleState.remainingMealIds
      .map((id) => mealMap.get(id))
      .filter((m): m is Meal => Boolean(m));
  }, [cycleState.remainingMealIds, mealMap]);

  // Yapılmışlar (Pişirilen Yemekler)
  const cookedMeals = useMemo(() => {
    return cycleState.cookedMealIds
      .map((id) => mealMap.get(id))
      .filter((m): m is Meal => Boolean(m));
  }, [cycleState.cookedMealIds, mealMap]);

  // Günün Menüsü (Seçili Yemek)
  const currentMeal = useMemo(() => {
    if (!cycleState.currentMealId) return null;
    return mealMap.get(cycleState.currentMealId) || null;
  }, [cycleState.currentMealId, mealMap]);

  // Rastgele bir yemek seç (Kalanlar arasından)
  const pickRandomMeal = useCallback((): Meal | null => {
    if (remainingMeals.length === 0) return null;
    const candidates = remainingMeals.filter((m) => m.id !== cycleState.currentMealId);
    const chosen = candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : remainingMeals[0];

    setCycleState((prev) => ({
      ...prev,
      currentMealId: chosen.id,
      lastUpdated: new Date().toISOString(),
    }));
    return chosen;
  }, [remainingMeals, cycleState.currentMealId]);

  // Çarktan gelen veya doğrudan seçilen yemeği aktif yap
  const selectMeal = useCallback((meal: Meal) => {
    setCycleState((prev) => ({
      ...prev,
      currentMealId: meal.id,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Konfeti kutlaması
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ff6b35", "#f59e0b", "#10b981", "#3b82f6", "#ec4899"],
      });
    } catch {
      // Confetti hatası olursa akışı bozma
    }
  }, []);

  // ✓ Pişirdim: Yemeği yapılmışlara aktar, döngüyü kontrol et
  const markAsCooked = useCallback((mealId: string) => {
    setCycleState((prev) => {
      const nextRemaining = prev.remainingMealIds.filter((id) => id !== mealId);
      const nextCooked = [...prev.cookedMealIds, mealId];

      // KRİTİK KURAL: Yapılacaklar listesi sıfırlandı mı?
      if (nextRemaining.length === 0) {
        // Döngü tamamlandı!
        setTimeout(() => triggerCelebration(), 100);

        const newCycleNumber = prev.cycleNumber + 1;
        // Tüm yemekleri baştan yapılacaklara doldur
        const refreshedIds = allMeals.map((m) => m.id);
        const nextPick = refreshedIds[Math.floor(Math.random() * refreshedIds.length)] || null;

        return {
          cycleNumber: newCycleNumber,
          remainingMealIds: refreshedIds,
          cookedMealIds: [],
          currentMealId: nextPick,
          lastUpdated: new Date().toISOString(),
        };
      }

      // Normal adım: Kalanlardan yeni bir tane seç
      const nextCandidates = nextRemaining;
      const nextPick = nextCandidates.length > 0
        ? nextCandidates[Math.floor(Math.random() * nextCandidates.length)]
        : null;

      return {
        ...prev,
        remainingMealIds: nextRemaining,
        cookedMealIds: nextCooked,
        currentMealId: nextPick,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, [allMeals, triggerCelebration]);

  // Sonradan Yemek Ekleme
  const addCustomMeal = useCallback((newMealData: Omit<Meal, "id" | "isCustom" | "createdAt">): Meal => {
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newMeal: Meal = {
      ...newMealData,
      id,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    setCustomMeals((prev) => [newMeal, ...prev]);

    // Anında aktif döngünün Yapılacaklar havuzuna ekle
    setCycleState((prev) => ({
      ...prev,
      remainingMealIds: [id, ...prev.remainingMealIds],
      lastUpdated: new Date().toISOString(),
    }));

    return newMeal;
  }, []);

  // Yemek Silme
  const deleteMeal = useCallback((mealId: string) => {
    setCustomMeals((prev) => prev.filter((m) => m.id !== mealId));

    setCycleState((prev) => {
      const filteredRemaining = prev.remainingMealIds.filter((id) => id !== mealId);
      const filteredCooked = prev.cookedMealIds.filter((id) => id !== mealId);
      const nextCurrent = prev.currentMealId === mealId
        ? (filteredRemaining[0] || null)
        : prev.currentMealId;

      return {
        ...prev,
        remainingMealIds: filteredRemaining,
        cookedMealIds: filteredCooked,
        currentMealId: nextCurrent,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  // Döngüyü Manuel Sıfırla
  const resetCycle = useCallback(() => {
    const allIds = allMeals.map((m) => m.id);
    const firstPick = allIds[Math.floor(Math.random() * allIds.length)] || null;

    setCycleState((prev) => ({
      ...prev,
      remainingMealIds: allIds,
      cookedMealIds: [],
      currentMealId: firstPick,
      lastUpdated: new Date().toISOString(),
    }));
  }, [allMeals]);

  return {
    allMeals,
    remainingMeals,
    cookedMeals,
    currentMeal,
    cycleNumber: cycleState.cycleNumber,
    totalCount: allMeals.length,
    remainingCount: remainingMeals.length,
    cookedCount: cookedMeals.length,
    pickRandomMeal,
    selectMeal,
    markAsCooked,
    addCustomMeal,
    deleteMeal,
    resetCycle,
  };
}
