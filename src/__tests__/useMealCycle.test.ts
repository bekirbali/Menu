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

  it("restoreMeal çağrıldığında pişirilen yemeği tekrar yapılacaklar havuzuna almalıdır", () => {
    const { result } = renderHook(() => useMealCycle());
    const initialMeal = result.current.currentMeal!;

    // Önce pişir
    act(() => {
      result.current.markAsCooked(initialMeal.id);
    });

    expect(result.current.cookedCount).toBe(1);
    expect(result.current.cookedMeals.some((m) => m.id === initialMeal.id)).toBe(true);

    // Şimdi havuza geri al
    act(() => {
      result.current.restoreMeal(initialMeal.id);
    });

    expect(result.current.cookedCount).toBe(0);
    expect(result.current.remainingCount).toBe(DEFAULT_MEALS.length);
    expect(result.current.remainingMeals.some((m) => m.id === initialMeal.id)).toBe(true);
    expect(result.current.cookedMeals.some((m) => m.id === initialMeal.id)).toBe(false);
  });

  it("generateFullCourseMenu dengeli 4'lü menü oluşturmalı ve markFullCourseCooked topluca pişirmelidir", () => {
    const { result } = renderHook(() => useMealCycle());

    act(() => {
      result.current.generateFullCourseMenu();
    });

    const menu = result.current.fullCourseMenu;
    expect(menu).not.toBeNull();
    expect(menu?.soup).not.toBeNull();
    expect(menu?.mainCourse).not.toBeNull();
    expect(menu?.sideDish).not.toBeNull();
    expect(menu?.dessert).not.toBeNull();

    act(() => {
      result.current.markFullCourseCooked();
    });

    // Menüdeki 4 yemeğin de cooked havuzuna geçtiğini doğrula
    expect(result.current.cookedCount).toBe(4);
    expect(result.current.cookedMeals.some((m) => m.id === menu?.soup?.id)).toBe(true);
    expect(result.current.cookedMeals.some((m) => m.id === menu?.mainCourse?.id)).toBe(true);
    expect(result.current.cookedMeals.some((m) => m.id === menu?.sideDish?.id)).toBe(true);
    expect(result.current.cookedMeals.some((m) => m.id === menu?.dessert?.id)).toBe(true);
  });

  it("başlangıçta 10 kült Türk menüsünü yüklemeli ve kullanıcı yeni menü ekleyebilmelidir", () => {
    const { result } = renderHook(() => useMealCycle());

    expect(result.current.allCuratedMenus.length).toBe(10);
    expect(result.current.activeCuratedMenu).not.toBeNull();
    expect(result.current.activeCuratedMenu.name).toBe("Kuru Fasulye & Pilav Klasiği");

    act(() => {
      result.current.addCustomMenu({
        name: "Özel Pazar Ziyafeti",
        soup: "Mercimek Çorbası",
        mainDish: "Kuzu İncik & İç Pilav",
        sideDish: "Köz Biber & Salata",
        dessert: "Kazandibi",
      });
    });

    expect(result.current.allCuratedMenus.length).toBe(11);
    expect(result.current.activeCuratedMenu.name).toBe("Özel Pazar Ziyafeti");
  });
});

