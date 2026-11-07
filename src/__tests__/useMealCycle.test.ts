import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMealCycle } from "../hooks/useMealCycle";
import { DEFAULT_MEALS } from "../data/defaultMeals";

// canvas-confetti mock
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

describe("useMealCycle Çekirdek Döngü Algoritması", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("başlangıçta varsayılan 40 yemeği yapılacaklar havuzuna yüklemelidir", () => {
    const { result } = renderHook(() => useMealCycle());

    expect(result.current.cycleNumber).toBe(1);
    expect(result.current.totalCount).toBe(DEFAULT_MEALS.length);
    expect(result.current.remainingCount).toBe(DEFAULT_MEALS.length);
    expect(result.current.cookedCount).toBe(0);
    expect(result.current.currentMeal).not.toBeNull();
  });

  it("markAsCooked çağrıldığında yemeği yapılacaklardan yapılmışlara aktarmalıdır", () => {
    const { result } = renderHook(() => useMealCycle());
    const initialMeal = result.current.currentMeal!;

    act(() => {
      result.current.markAsCooked(initialMeal.id);
    });

    expect(result.current.remainingCount).toBe(DEFAULT_MEALS.length - 1);
    expect(result.current.cookedCount).toBe(1);
    expect(result.current.cookedMeals.some((m) => m.id === initialMeal.id)).toBe(true);
    expect(result.current.remainingMeals.some((m) => m.id === initialMeal.id)).toBe(false);
  });

  it("yapılacaklar tükendiğinde döngü sayacı artmalı ve tüm yemekler havuza geri dönmelidir", () => {
    const { result } = renderHook(() => useMealCycle());

    // Listedeki tüm yemekleri sırayla pişir
    act(() => {
      const allIds = [...result.current.remainingMeals.map((m) => m.id)];
      allIds.forEach((id) => {
        result.current.markAsCooked(id);
      });
    });

    // Döngü tamamlandı!
    expect(result.current.cycleNumber).toBe(2);
    expect(result.current.remainingCount).toBe(DEFAULT_MEALS.length);
    expect(result.current.cookedCount).toBe(0);
  });

  it("kullanıcı sonradan özel yemek eklediğinde anında yapılacaklar havuzuna girmelidir", () => {
    const { result } = renderHook(() => useMealCycle());

    act(() => {
      result.current.addCustomMeal({
        name: "Özel Fırın Somon",
        category: "firin",
        ingredients: ["Somon", "Limon"],
      });
    });

    expect(result.current.totalCount).toBe(DEFAULT_MEALS.length + 1);
    expect(result.current.remainingMeals.some((m) => m.name === "Özel Fırın Somon")).toBe(true);
  });

  it("özel yemek silindiğinde havuzdan temizlenmelidir", () => {
    const { result } = renderHook(() => useMealCycle());

    let addedId = "";
    act(() => {
      const added = result.current.addCustomMeal({
        name: "Geçici Yemek",
        category: "pratik",
        ingredients: [],
      });
      addedId = added.id;
    });

    expect(result.current.remainingMeals.some((m) => m.id === addedId)).toBe(true);

    act(() => {
      result.current.deleteMeal(addedId);
    });

    expect(result.current.remainingMeals.some((m) => m.id === addedId)).toBe(false);
  });
});

